/*
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
 */

// mod front_of_house {
//     mod hosting {
//         fn add_to_waitlist() {}
//         fn seat_at_table() {}
//     }

//     mod serving {
//         fn take_order() {}
//         fn serve_order() {}
//         fn take_payment() {}
//     }
// }

//============================
mod front_of_house;

// use keyword to bring the path into the scope
use front_of_house::hosting;
// use crate::front_of_house::hosting;
// use self::front_of_house::hosting;  // self repr curr module

pub fn eat_at_restaurant() {
    // Absolute path
    crate::front_of_house::hosting::add_to_waitlist();

    // Relative path
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}

// ===========================
fn serve_order() {}

mod back_of_house {
    fn fix_incorrect_order() {
        cook_order();
        // Relative path using super keyword
        super::serve_order();
        // Absolute Path
        crate::serve_order();
    }
    fn cook_order() {}
}

//=============================
mod restaurant {
    pub enum Appetizer {
        Soup,
        Salad
    }

    pub struct Breakfast {
        pub toast: String,
        sesonal_fruit: String,
    }

    impl Breakfast {
        pub fn summer(toast: &str) -> Breakfast {
            Breakfast {
                toast: String::from(toast),
                sesonal_fruit: String::from("mango"),
            }
        }
    }
}

pub fn eat_breakfast() {
    let order = restaurant::Appetizer::Salad;

    let mut meal = restaurant::Breakfast::summer("Rye");
    meal.toast = String::from("wheat");
    // we can't create Breakfast struct, becaz it contains a private field in it
    // it can only be created by restaurant::Breakfast::summer()

    // let meal2 = restaurant::Breakfast {
    //     toast: String::from("rice"),
    //     sesonal_fruit: String::from("peaches")  // field is private
    // }; 
}


//===========================
// 1 => if you import something that has same name then don't import the complete thing just import the parent module and use with specifying the parent module
use std::fmt;
use std::io;
// fn s1() -> fmt::Result {}
// fn s2() -> io::Result<()> {}

// 2 => or another method is to use the `as` to rename it 
use std::fmt::Result;
use std::io::Result as IoResult;


// use std::io::{self, Write};
