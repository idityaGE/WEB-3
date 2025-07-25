#![allow(dead_code)]

use std::cmp::PartialOrd;

fn get_largest<T: PartialOrd + Copy>(list: &Vec<T>) -> T {
    let mut largest = list[0];
    for item in list {
        if largest < *item {
            largest = *item;
        }
    }
    largest
}

#[derive(Debug)]
struct Point<T: PartialOrd> {
    x: T,
    y: T,
}

impl<T: PartialOrd> Point<T> {
    fn is_same(&self, p: &Point<T>) -> bool {
        if self.x == p.x && self.y == p.y {
            return true;
        }
        false
    }
}

fn main() {
    let char_list = vec!['y', 'a', 'd', 'u'];
    let largest_char = get_largest(&char_list);
    println!("{largest_char}");

    let num_list = vec![6, 4, 2, 9, 4];
    let largest_num = get_largest(&num_list);
    println!("{largest_num}");
}
