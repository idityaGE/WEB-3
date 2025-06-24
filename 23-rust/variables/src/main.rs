use std::{f32::consts::PI, fs};

const _THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;

struct Reactangle {
    width: f32,
    height: f32,
}

impl Reactangle {
    pub fn area(&self) -> f32 {
        return self.height * self.width;
    }

    fn what() -> &'static str {
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
        idx = idx + 1;
        if c == 'a' || c == 'A' {
            return Some(idx);
        }
    }
    None
}

fn main() {
    let s = String::from("boom bam");
    let ans = find_first_a(&s);
    match ans {
        Some(ans) => println!("index of first a is : {}", ans),
        None => println!("no is a is present")
    }

    let content = fs::read_to_string("a.txt");
    match content {
        Ok(content) => print!("{content}"),
        Err(e) => println!("{}", e),
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
    println!("{}", Reactangle::what());

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
