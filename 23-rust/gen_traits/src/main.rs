use std::{
    f32::consts::PI,
    fmt::{Debug, Display},
    io,
    ops::Mul,
};
pub mod test;

trait Shape {
    fn area(&self) -> f32;

    // give a default implementation
    fn summary(&self) -> String {
        "Default Implementation".to_owned()
    }
}
struct Rectangle<T> {
    width: T,
    height: T,
}

impl<T: Mul<Output = f32> + Copy> Shape for Rectangle<T> {
    fn area(&self) -> f32 {
        return self.width * self.height;
    }
}

struct Circle<T> {
    radius: T,
}

impl<T: Mul<Output = f32> + Copy> Shape for Circle<T> {
    fn area(&self) -> f32 {
        return PI * (self.radius * self.radius);
    }
}

fn print_area<T: Shape>(s: T) {
    println!("{}", s.area())
}

// Macro

macro_rules! say_my_name {
    () => {
        println!("Adii 🐧");
    };
}

#[derive(Debug)]
struct User {
    name: String,
    password: String,
    age: u8,
}

impl Display for User {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "User {{\n\tname: {}\n\tpassword: {}\n\tage: {}\n}}\n",
            self.name, self.password, self.age
        )
    }
}

#[derive(Debug, Clone, Copy)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    // cargo install cargo-expand (binary)
    // cargo expand
    let p1 = Point { x: 1, y: 1 };
    let p2 = p1;
    println!("{:?} {:?}", p1, p2);

    let u = User {
        name: "Aditya".to_string(),
        password: "no_gonna_tell_you".to_string(),
        age: 20,
    };
    // {} => display, {:?} => debug
    println!("{:?}", u); // there is macro to impl Debug trait
    println!("{}", u); // no macro for Display trait

    say_my_name!();

    //* Tuple
    let tup: (i32, u32, bool) = (2, 32, true);
    let (a, b, c) = &tup;
    let x = &tup.0;
    let j = &tup.1;
    // The tuple without any values has a special name, unit.
    // This value and its corresponding type are both written () and represent an empty value or an empty return type.
    // Expressions implicitly return the unit value if they don’t return any other value.

    //* Array
    let arr = [1, 2, 3, 4, 5];
    let _c_arr = [3; 5];

    let mut index = String::new();
    io::stdin()
        .read_line(&mut index)
        .expect("Failed to reaad the input");
    let index: usize = index
        .trim()
        .parse()
        .expect("Index entered was not a number");
    println!("{}", arr[index]);

    let _xn = {
        let x = 3;
        x + 1
    };

    let condition = true;
    let _y = if condition { 5 } else { 6 };
    // let yn = if condition { 5 } else { "six" }; // Error: `if` and `else` have incompatible types

    loop {
        println!("Agaian!");
        break;
    }

    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 10 {
            // You can also return from inside a loop.
            // While break only exits the current loop, return always exits the current function.
            break counter * 2;
        }
    };
    println!("reult : {result}");

    let _v = vec![2; 5];
}
