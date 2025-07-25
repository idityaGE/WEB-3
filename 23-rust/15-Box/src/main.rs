use std::fmt::Display;

// its a recusive type which size can't be determined at compile time
enum List<T> {
    Cons(T, Box<List<T>>),
    Nil,
}

impl<T> Display for List<T>
where
    T: Display,
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Cons(val, next) => {
                write!(f, "{}", val)?;
                if let Cons(_, _) = **next {
                    write!(f, " -> ")?;
                }
                next.fmt(f)
            }
            Nil => write!(f, " -> nil"),
        }
    }
}

// using this line so that we don't need to write "List::Cons" everytime, just "Cons"
use List::{Cons, Nil};

fn main() {
    let b = Box::new(5);
    println!("b = {b}");

    let list = Cons(20, Box::new(Cons(4, Box::new(Cons(3, Box::new(Nil))))));
    println!("{}", list);

    let mut list = LinkedList::new(2);
    list.insert(20);
    list.insert(30);
    println!("{}", list);
}

// Linked List Implementation
struct LinkedList<T> {
    val: T,
    next: Option<Box<LinkedList<T>>>,
}

impl<T> LinkedList<T> {
    pub fn new(val: T) -> Self {
        LinkedList { val, next: None }
    }
    pub fn insert(&mut self, val: T) {
        if self.next.is_none() {
            self.next = Some(Box::new(LinkedList::new(val)));
        } else {
            if let Some(ref mut next) = self.next {
                next.insert(val);
            }
        }
    }
}

impl<T> Display for LinkedList<T>
where
    T: Display,
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.val)?;
        match self.next {
            Some(ref next) => {
                write!(f, " -> ")?;
                next.fmt(f)
            }
            None => write!(f, " -> nil"),
        }
    }
}
