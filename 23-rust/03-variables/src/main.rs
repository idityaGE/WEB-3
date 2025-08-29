use chrono::{Local, Utc};
use std::{f32::consts::PI, fs, ops::Mul};
// use chrono::prelude::*;
use dotenv::dotenv;
use std::env;

const _THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;

struct Reactangle<T> {
    width: T,
    height: T,
}

impl<T: Mul<Output = T> + Copy> Reactangle<T> {
    pub fn area(&self) -> T {
        return self.height * self.width;
    }

    fn _what() -> &'static str {
        // if you don't accept the &self then its similar to static function
        return "Boom reactangle";
    }
}

enum Shape {
    Square(f32), // value associated with the enums
    Circle(f32),
    Rectangle(f32, f32),
}

impl Shape {
    pub fn get_area(&self) -> f32 {
        let area = match self {
            Shape::Circle(radius) => (radius * radius) * PI,
            Shape::Square(side) => side * side,
            Shape::Rectangle(height, width) => height * width,
        };
        area
    }
}

fn find_first_a(s: &String) -> Option<u32> {
    let mut idx: u32 = 0;
    for c in s.chars() {
        if c == 'a' || c == 'A' {
            return Some(idx);
        }
        idx += 1;
    }
    None
}

fn _sum<T: std::ops::Add<Output = T>>(a: T, b: T) -> T {
    // "std::ops::Add<Output = T>" trait bound
    return a + b;
}

fn _display<T: std::fmt::Display>(item: T) {
    println!("{item}");
}

fn _compare<T: Ord>(a: T, b: T) -> bool {
    if a > b {
        return true;
    }
    false
}

fn main() {
    println!("{}", 0xff); // hexadecimal form : 0xff = 1111_1111 => 255
    println!("{}", 0b1111_0000); // binary form : 0b1111_0000 => 240

    dotenv().ok();
    let var = env::var("SAMPLE_ENV").unwrap();
    println!("ENV = {var}");

    let time = Utc::now();
    let local_time = Local::now();
    println!("{time}");
    println!("{local_time}");

    let s = String::from("boom bam");
    let ans = find_first_a(&s);
    match ans {
        Some(ans) => println!("index of first a is : {}", ans),
        None => println!("no is a is present"),
    }

    let content = fs::read_to_string("a.txt");
    match content {
        Ok(content) => print!("{content}"),
        Err(e) => println!("{}", e),
        // _ => println!("WTF") // catch all
    }

    let sq = Shape::Square(20.0);
    let cir = Shape::Circle(3.4);
    let rec = Shape::Rectangle(20.0, 40.0);
    println!("area : {}", sq.get_area());
    println!("area : {}", cir.get_area());
    println!("area : {}", rec.get_area());

    if let Shape::Circle(x) = cir {
        println!("{x}");
    }

    let r = Reactangle {
        width: 20.0,
        height: 30.0,
    };

    println!("{}", r.area());
    // println!("{}", Reactangle::_what());

    let x = 5;
    let mut x = x + 1; // Shadowing
    x += 1;
    println!("{x}");
    {
        let x = x * 2;
        println!("{x}");
    }
    println!("{x}");

    let spaces = "      ";
    let spaces = spaces.len();
    println!("{}", spaces);
}

/*
function sum<T extends number | string>(a: T, b: T): T {
    return (a as any) + (b as any);
}
*/
