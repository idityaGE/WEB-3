#![allow(unused_variables, dead_code)]

//* enum Result<T, E> {
//*     Ok(T),
//*     Err(E)
//* }

use std::error::Error as DError;
use std::fs::{self, File};
use std::io::{Error, ErrorKind, Read};

fn main() -> Result<(), Box<dyn DError>> {
    // best way to handle error is just
    // panic!("not kidding");

    // a();

    // lets handle it the bad way (gracefully) -> bad word
    let fp = File::open("hello.txt");
    // let fp = File::open("hello.txt").unwrap();
    // let fp = File::open("hello.txt").expect("Failed to open hello.txt");
    let fp = match fp {
        // this thing is match hell like callback hell in js
        Ok(f) => f,
        Err(e) => {
            println!("Not able to open hello.txt : {:?}", e);
            match e.kind() {
                ErrorKind::NotFound => match File::create("hello.txt") {
                    Ok(file) => file,
                    Err(e) => panic!("Not able to create file"),
                },
                other_error => {
                    panic!("Fuck of match nesting {:?}", other_error);
                }
            }
        }
    };

    // this nesting thing is not easy to read to solve this problem we have closures
    let f = File::open("hello.txt").unwrap_or_else(|err| {
        if ErrorKind::NotFound == err.kind() {
            File::create("hello.txt").unwrap_or_else(|err| {
                panic!("not able to  create file {:?}", err);
            })
        } else {
            panic!("problem opening the file {:?}", err)
        }
    });

    // Error Propogation
    let username = match read_username_file() {
        Ok(user) => user,
        Err(e) => {
            println!("{:?}", e);
            String::new()
        }
    };
    println!("{:?}", username);

    // onliner 
    fs::read_to_string("hello.txt")?; // we need to add Result<(), Box<dyn Error>> as return type
    Ok(())
}

fn read_username_file() -> Result<String, Error> {
    let mut f = File::open("hello.txt")?; // we can't use ? operator in main fn because our main fn doesn't retuen any thing 
    // let mut f = match f {
    //     Ok(file) => file,
    //     Err(e) => return Err(e),
    // };

    let mut username = String::new();
    // match f.read_to_string(&mut username) {
    //     Ok(_) => Ok(username),
    //     Err(e) => Err(e),
    // }
    f.read_to_string(&mut username)?;
    Ok(username)
}

fn a() {
    b();
}

fn b() {
    c(22);
}

fn c(num: i32) {
    if num == 22 {
        panic!("cursh and burn everything");
    }
}
