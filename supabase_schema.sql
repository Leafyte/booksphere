-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Create Users Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data, and admins to read all
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" 
ON public.users FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Allow insert via trigger (see below)

-- 2. Create Books Table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  genre TEXT NOT NULL,
  cover_url TEXT,
  rack_number TEXT,
  inventory_count INTEGER DEFAULT 1,
  available_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Everyone can read books
CREATE POLICY "Books are viewable by everyone" 
ON public.books FOR SELECT 
USING (true);

-- Only admins can modify books
CREATE POLICY "Admins can modify books" 
ON public.books FOR ALL 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- 3. Create Borrow Requests Table
CREATE TABLE IF NOT EXISTS public.borrow_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'returned')),
  borrow_date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  returned_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.borrow_requests ENABLE ROW LEVEL SECURITY;

-- Students can view their own requests, admins can view all
CREATE POLICY "Users view own requests" 
ON public.borrow_requests FOR SELECT 
USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Students can insert requests
CREATE POLICY "Students can insert requests" 
ON public.borrow_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'student'));

-- Admins can update requests
CREATE POLICY "Admins can update requests" 
ON public.borrow_requests FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- 4. Auth Hook: Automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, student_id, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'student_id',
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 5. Helper Function: Check Book Availability before inserting a request
CREATE OR REPLACE FUNCTION public.check_book_availability()
RETURNS TRIGGER AS $$
DECLARE
  av_count INTEGER;
BEGIN
  -- Only care if status is being set to approved
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    SELECT available_count INTO av_count FROM public.books WHERE id = NEW.book_id;
    IF av_count <= 0 THEN
      RAISE EXCEPTION 'Book is not available';
    END IF;
    -- Decrement available count
    UPDATE public.books SET available_count = available_count - 1 WHERE id = NEW.book_id;
    
    -- Set borrow and due dates
    IF NEW.borrow_date IS NULL THEN
      NEW.borrow_date = now();
      NEW.due_date = now() + INTERVAL '14 days';
    END IF;
  END IF;

  -- If returning, increment available count
  IF NEW.status = 'returned' AND OLD.status = 'approved' THEN
    UPDATE public.books SET available_count = available_count + 1 WHERE id = NEW.book_id;
    NEW.returned_date = now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_request_status_change
  BEFORE UPDATE ON public.borrow_requests
  FOR EACH ROW EXECUTE PROCEDURE public.check_book_availability();
