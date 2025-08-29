#![allow(dead_code, unused_variables)]

use std::fmt::{Debug, Display};

struct NewsArticle {
    pub author: String,
    pub headline: String,
    pub content: String,
}

struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

pub trait Summary {
    fn summarize(&self) -> String;

    //* Default implementation
    // fn summarize(&self) -> String {
    //     String::from("you haven't impl summarize trait yet...")
    // }
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}: {}", self.author, self.content)
    }
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("@{}: {}", self.username, self.content)
    }
}

// fn notify(item: &impl Summary) {
//     println!("Breaking news : {}", item.summarize())
// }

fn notify<T: Summary>(item: &T) {
    println!("Breaking news : {}", item.summarize())
}

// in this code there is an issue, what if the user send two diff item type which impl Summay
pub fn notify1(item1: &impl Summary, item2: &impl Summary) {
    //
}

// here user can only send one item type
pub fn notify2<T: Summary + Display>(item1: &T, item2: &T) {
    //
}

// fn some_fn<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) {
//     //
// }
// improved readbility
fn some_fn<T, U>(t: &T, u: &U)
where
    T: Display + Clone,
    U: Debug + Clone,
{
    //
}

// returning impl trait
fn return_summarizable() -> impl Summary {
    // you can only return one type which implement Summary
    // not the two types which impl Summary trait based on some bool passed for example
    Tweet {
        username: String::from("idityage"),
        content: String::from("it just rust what so hard about it ? huh !"),
        reply: false,
        retweet: true,
    }
}

// =============================
struct Pair<T, U> {
    first: T,
    second: U,
}

impl<T, U> Pair<T, U> {
    fn new(first: T, second: U) -> Self {
        Self { first, second }
    }
}
// this will be available to those who has impl Debug and PartialOrd
impl<T, U> Pair<T, U>
where
    T: Debug + PartialOrd,
    U: Debug + PartialOrd,
{
    //
}

// Triat on triat
// impl<T: Display> ToString for T {
//     //
// }

fn main() {
    let tweet = Tweet {
        username: String::from("idityage"),
        content: String::from("it just rust what so hard about it ? huh !"),
        reply: false,
        retweet: true,
    };

    let news = NewsArticle {
        author: "Roshan".to_string(),
        headline: "headline".to_string(),
        content: "what content ?".to_string(),
    };

    println!("{}", tweet.summarize());
    println!("{}", news.summarize());

    notify(&tweet);
    notify(&news);
}
