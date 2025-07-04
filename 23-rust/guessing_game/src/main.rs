use std::cmp::Ordering;
use std::io;

use rand::Rng;

// prelude
// associalte function of a type

fn main() {
    println!("Guess the number!");

    let secret_num: u8 = rand::thread_rng().gen_range(1..=100);
    let mut cnt = 0;

    loop {
        println!("\nPlease input your guess.");

        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read the line");

        println!("Your guess : {guess}");

        let guess: u8 = match guess.trim().parse() {
            Ok(num) => {
                cnt += 1;
                num
            }
            Err(_) => {
                // The underscore, _, is a catch-all value; in this example, we’re saying we want to match all Err values, no matter what information they have inside them.
                println!("please enter a number");
                continue; // go to next iteration
            }
        };

        if guess > 100 {
            println!("Value can only be from 0 to 100");
            continue;
        }

        match guess.cmp(&secret_num) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                println!("\nyou took {cnt} guess");
                break;
            }
        }
    }
}
