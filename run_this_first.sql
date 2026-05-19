-- ============================================================
-- RUN THIS ENTIRE SCRIPT IN YOUR SUPABASE SQL EDITOR
-- It fixes the RLS infinite recursion + seeds all books
-- ============================================================

-- STEP 1: Fix infinite recursion in RLS policies
-- Create a SECURITY DEFINER function so policies don't recurse
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop the broken recursive policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can modify books" ON public.books;
DROP POLICY IF EXISTS "Users view own requests" ON public.borrow_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON public.borrow_requests;

-- Recreate them using the safe is_admin() function
CREATE POLICY "Admins can view all users" 
ON public.users FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can modify books" 
ON public.books FOR ALL 
USING (public.is_admin());

CREATE POLICY "Users view own requests" 
ON public.borrow_requests FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can update requests" 
ON public.borrow_requests FOR UPDATE 
USING (public.is_admin());

-- ============================================================
-- STEP 2: Clear existing books and insert all new books
-- ============================================================
TRUNCATE TABLE public.books CASCADE;

-- Mathematics-III for IT Stream
INSERT INTO public.books (title, author, genre, inventory_count, available_count) VALUES
('Higher Engineering Mathematics', 'B. S. Grewal', 'Mathematics', 5, 5),
('Higher Engineering Mathematics', 'B. V. Ramana', 'Mathematics', 3, 3),
('Discrete and Combinatorial Mathematics', 'R. P. Grimaldi', 'Mathematics', 4, 4),
('Advanced Engineering Mathematics', 'Erwin Kreyszig', 'Mathematics', 5, 5),
('Advanced Engineering Mathematics', 'Peter V. O''Neil', 'Mathematics', 2, 2),
('Advanced Engineering Mathematics', 'R. K. Jain & S. R. K. Iyengar', 'Mathematics', 3, 3);

-- Data Structures
INSERT INTO public.books (title, author, genre, inventory_count, available_count) VALUES
('Fundamentals of Data Structures in C', 'Ellis Horowitz and Sartaj Sahni', 'Data Structures', 5, 5),
('Data Structures Schaum''s Outlines', 'Seymour Lipschutz', 'Data Structures', 4, 4),
('Programming and Data Structure', 'Jackulin C Salini et al.', 'Data Structures', 2, 2),
('Learning JavaScript Data Structures and Algorithms', 'Loiane Groner', 'Data Structures', 3, 3);

-- Operating System
INSERT INTO public.books (title, author, genre, inventory_count, available_count) VALUES
('Operating System Concepts', 'Abraham Silberschatz, Peter Baer Galvin, Greg Gagne', 'Operating Systems', 6, 6),
('Modern Operating Systems', 'Andrew S. Tanenbaum & Herbert Bos', 'Operating Systems', 4, 4),
('Operating Systems: Principles and Practice', 'Thomas Anderson & Michael Dahlin', 'Operating Systems', 2, 2),
('Operating Systems Internals and Design Principles', 'William Stallings', 'Operating Systems', 3, 3);

-- Computer Organization
INSERT INTO public.books (title, author, genre, inventory_count, available_count) VALUES
('Computer Organization', 'Carl Hamacher, Zvonko Vranesic, Safwat Zaky', 'Computer Organization', 5, 5),
('Computer Organization & Architecture', 'William Stallings', 'Computer Organization', 4, 4);

-- Universal Human Values
INSERT INTO public.books (title, author, genre, inventory_count, available_count) VALUES
('Human Values and Professional Ethics', 'R. R. Gaur, R. Sangal, G. P. Bagaria', 'Humanities / Ethics', 5, 5),
('Jeevan Vidya: Ek Parichaya', 'A. Nagaraj', 'Humanities / Ethics', 2, 2),
('Human Values', 'A. N. Tripathi', 'Humanities / Ethics', 3, 3),
('The Story of Stuff', 'Unknown', 'Humanities / Ethics', 2, 2),
('The Story of My Experiments with Truth', 'Mahatma Gandhi', 'Humanities / Ethics', 4, 4),
('Small is Beautiful', 'E. F. Schumacher', 'Humanities / Ethics', 2, 2),
('Slow is Beautiful', 'Cecile Andrews', 'Humanities / Ethics', 2, 2),
('Economy of Permanence', 'J. C. Kumarappa', 'Humanities / Ethics', 2, 2),
('Bharat Mein Angreji Raj', 'Pandit Sunderlal', 'Humanities / Ethics', 2, 2),
('Rediscovering India', 'Dharampal', 'Humanities / Ethics', 2, 2),
('Hind Swaraj or Indian Home Rule', 'Mahatma Gandhi', 'Humanities / Ethics', 3, 3),
('India Wins Freedom', 'Maulana Abdul Kalam Azad', 'Humanities / Ethics', 3, 3),
('Vivekananda', 'Romain Rolland', 'Humanities / Ethics', 2, 2),
('Gandhi', 'Romain Rolland', 'Humanities / Ethics', 2, 2);

-- Additional Mathematics-III
INSERT INTO public.books (title, author, genre, inventory_count, available_count) VALUES
('Linear Algebra and Its Applications', 'Gilbert Strang', 'Mathematics', 4, 4),
('Differential Equations', 'S. L. Ross', 'Mathematics', 3, 3),
('Numerical Analysis', 'Richard L. Burden & J. Douglas Faires', 'Mathematics', 3, 3),
('Advanced Modern Engineering Mathematics', 'Glyn James', 'Mathematics', 2, 2),
('A Textbook of Engineering Mathematics', 'N. P. Bali & Manish Goyal', 'Mathematics', 4, 4),
('Advanced Engineering Mathematics', 'C. Ray Wylie & Louis C. Barrett', 'Mathematics', 2, 2),
('Linear Algebra with Applications', 'Steven Leon', 'Mathematics', 3, 3);

-- Mathematics-IV for IT Stream
INSERT INTO public.books (title, author, genre, inventory_count, available_count) VALUES
('Contemporary Abstract Algebra', 'J. A. Gallian', 'Mathematics', 3, 3),
('Probability and Stochastic Processes', 'Roy D. Yates & David J. Goodman', 'Mathematics', 3, 3),
('Probability and Statistical Applications', 'P. L. Meyer', 'Mathematics', 3, 3),
('Probability and Statistics with Reliability, Queuing and Computer Science Applications', 'Kishore S. Trivedi', 'Mathematics', 2, 2),
('Introduction to Probability', 'Dimitri P. Bertsekas & John N. Tsitsiklis', 'Mathematics', 3, 3);

-- Design and Analysis of Algorithms
INSERT INTO public.books (title, author, genre, inventory_count, available_count) VALUES
('Introduction to the Design and Analysis of Algorithms', 'Anany Levitin', 'Algorithms', 5, 5),
('Computer Algorithms/C++', 'Ellis Horowitz, Sartaj Sahni, Sanguthevar Rajasekaran', 'Algorithms', 4, 4),
('Algorithm Design', 'John Kleinberg & Eva Tardos', 'Algorithms', 4, 4),
('Algorithms', 'S. Dasgupta, C. H. Papadimitriou, U. Vazirani', 'Algorithms', 4, 4);

-- Software Engineering and Project Management
INSERT INTO public.books (title, author, genre, inventory_count, available_count) VALUES
('Software Engineering', 'Ian Sommerville', 'Software Engineering', 5, 5),
('Software Project Management', 'Bob Hughes, Mike Cotterell, Rajib Mall', 'Software Engineering', 4, 4),
('Software Engineering: A Practitioner''s Approach', 'Roger S. Pressman', 'Software Engineering', 5, 5),
('Foundations of Software Testing', 'Aditya P. Mathur', 'Software Engineering', 3, 3);

-- Database Management System Laboratory
INSERT INTO public.books (title, author, genre, inventory_count, available_count) VALUES
('Fundamentals of Database Systems', 'Ramez Elmasri & Shamkant B. Navathe', 'Database Management', 6, 6),
('Database System Concepts', 'Silberschatz, Korth & Sudharshan', 'Database Management', 5, 5),
('Database Principles Fundamentals of Design, Implementation and Management', 'Coronel, Morris & Rob', 'Database Management', 3, 3),
('Database Management Systems', 'Ramakrishnan & Gehrke', 'Database Management', 4, 4);

-- Biology for IT Engineers
INSERT INTO public.books (title, author, genre, inventory_count, available_count) VALUES
('Biology for Engineers', 'AICTE / Wiley Publication', 'Biology', 4, 4),
('A Textbook to Human Physiology', 'H. S. Ravi Kumar Patil et al.', 'Biology', 2, 2),
('Bioinformatics Methods & Application', 'Dev Bukhsh Singh & Rajeshkumar Pathak', 'Biology', 2, 2),
('Advances in Swarm Intelligence for Optimizing Problems in Computer Science', 'Anand Nayyar et al.', 'Biology', 2, 2),
('Biology for Engineers', 'Arthur T. Johnson', 'Biology', 3, 3),
('Biology for Engineers', 'Sohini Singh & Tanu Allen', 'Biology', 3, 3);
