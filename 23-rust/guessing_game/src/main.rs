use std::io;
use rand::Rng;
// prelude 
// associalte function of a type


fn main() {
    println!("Guess the number!");
    println!("Please input your guess.");

    let mut guess = String::new();
    // let mut cnt = 0;

    io::stdin()
    .read_line(&mut guess)
    .expect("Failed to read the line");

    println!("Your guess : {guess}");

}
