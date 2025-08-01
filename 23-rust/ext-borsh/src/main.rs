#![allow(unused_variables)]

use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
struct User {
    id: usize,
    name: String,
    password: String,
    age: u8,
}

#[derive(BorshDeserialize, BorshSerialize)]
enum Counter {
    Increment(u32),
    Decrement(u32),
}

fn main() {
    let u = User {
        id: 69,
        name: String::from("Aditya"),
        password: String::from("passorod"),
        age: 20,
    };

    let mut buffer: Vec<u8> = Vec::new();
    u.serialize(&mut buffer).unwrap();
    println!("{:?}", buffer);

    let dece = User::try_from_slice(&buffer).unwrap();
    assert_eq!(u, dece);
    println!("{:?}", dece);

    let inc = Counter::Increment(1);
    let mut buffer: Vec<u8> = Vec::new();
    inc.serialize(&mut buffer).unwrap();
    println!("{:?}", buffer);
}
