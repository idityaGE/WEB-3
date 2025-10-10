use std::fmt::{Display, Formatter, Result};

struct User<'a> {
    firstname: &'a String,
    lastname: &'a String,
}

impl<'a> Display for User<'a> {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        write!(f, "{}", self.firstname)
    }
}

fn longest_with_an_anouchment<'a, T>(x: &'a str, y: &'a str, ann: T) -> &'a str
where
    T: Display,
{
    println!("Annouchment: {ann}");
    if x.len() > y.len() {
        return x
    }
    y
}

fn main() {
    let s: &'static str = "I have a static lifetime, means I will live until the program runs";

    let str1 = String::from("Aditya");
    let ans;
    {
        let str2 = String::from("Maurya111");
        ans = longest_string(&str1, &str2); // returns the str2
        println!("{}", ans);
    } // --> str2 is valid till here 
    // lifetime of str2 is over after the block (out of scope)
    // then if the str2 is longestest then using 'ans' here will be a dangling pointer
    // println!("{}", ans); // --> str2 is not valid here anymore
}

// Lifetimes Inference is done by following rules.
// 3 Lifetime collision rules :
// - Each Parameter that is a reference gets its own lifetime parameter
// - If there is exactly one input lifetime parameter, that lifetimes is assigned to all the output lifetime parameters.
// - If there are multiple input lifetime parameter, but one of them is the &self the lifetime of self is assigned to all the output lifetime parameter.

// just use the same lifetime variable and the compiler will consider the smallest one
fn longest_string<'a>(s1: &'a String, s2: &'a String) -> &'a String {
    if s1.len() > s2.len() {
        return s1;
    }
    s2
}
// fn longest_string<'b, 'a: 'b>(s1: &'a String, s2: &'b String) -> &'b String {
//     if s1.len() > s2.len() {
//         return &s1
//     }
//     &s2
// }
