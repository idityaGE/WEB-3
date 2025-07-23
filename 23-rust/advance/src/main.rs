use std::fmt::{self, Display};
trait Iterator {
    // this associative type ensure that only one concrete type per implementation
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
// Generic allow us to create multiple concrete type impl
// trait Iterator<T> {
//     fn next(&mut self) -> Option<T>;
// }

// Operator Overloading
use std::ops::Add;
#[derive(Debug, PartialEq)]
struct Point<T> {
    x: T,
    y: T,
}
impl<T> Add for Point<T>
where
    T: Add<Output = T> + Display,
{
    type Output = Point<T>;
    fn add(self, rhs: Self) -> Self::Output {
        Point {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
        }
    }
}

impl<T> fmt::Display for Point<T>
where
    T: Display,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}
trait OutlinePrint: fmt::Display {
    fn outline_print(&self) {
        let output = self.to_string();
        let len = output.len();
        println!("{}", "*".repeat(len + 4));
        println!("*{}*", " ".repeat(len + 2));
        println!("* {output} *");
        println!("*{}*", " ".repeat(len + 2));
        println!("{}", "*".repeat(len + 4));
    }
}

impl<T> OutlinePrint for Point<T> where T: Display {}

// trait Add<Rhs=Self> {
//     type Output;
//     fn add(self, rhs: Rhs) -> Self::Output;
// }

struct Millimeters(u32);
struct Meters(u32);

impl Add<Meters> for Millimeters {
    type Output = Millimeters;
    fn add(self, other: Meters) -> Millimeters {
        Millimeters(self.0 + (other.0 * 1000))
    }
}

struct Wrapper(Vec<String>);

impl fmt::Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

fn main() {
    assert_eq!(
        Point { x: 1, y: 0 } + Point { x: 2, y: 3 },
        Point { x: 3, y: 3 }
    );

    let person = Human;
    person.fly();
    Pilot::fly(&person);
    Wizard::fly(&person);
    // <Human as Wizard>::fly(); // change to associated fn then try

    let w = Wrapper(vec![String::from("hello"), String::from("world")]);
    println!("w = {w}");
}

trait Pilot {
    fn fly(&self);
}
trait Wizard {
    fn fly(&self);
}
struct Human;

impl Pilot for Human {
    fn fly(&self) {
        println!("This is your captain speaking.");
    }
}
impl Wizard for Human {
    fn fly(&self) {
        println!("Up!");
    }
}
impl Human {
    fn fly(&self) {
        println!("*waving arms furiously*");
    }
}
