use std::fmt::Display;


struct User<'a> {
    firstname: &'a String,
    lastname: &'a String
}

impl<'a> Display for User<'a> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.firstname)
    }
}

fn main() {
    let str1 = String::from("Aditya");
    let ans;
    {
        let str2 = String::from("Maurya");
        ans = longest_string(&str1, &str2);
        println!("{}", ans);
    }
    // lifetime of str2 is over after the block (out of scope)
    // then if the str2 is longestest then using 'ans' here will be a dangling pointer
    // println!("{}", ans);
}

// just use the same lifetime variable and the compiler will consider the smallest one
fn longest_string<'a>(s1: &'a String, s2: &'a String) -> &'a String {
    if s1.len() > s2.len() {
        return &s1
    }
    &s2
}
// fn longest_string<'b, 'a: 'b>(s1: &'a String, s2: &'b String) -> &'b String {
//     if s1.len() > s2.len() {
//         return &s1
//     }
//     &s2
// }
