#![allow(unused_variables)]
use std::collections::HashMap;

fn main() {
    // [x] #===================== Vec =====================#
    // FIXME:  Good Morning
    // TODO: Noting to do

    let vv = vec![1, 2, 3, 4, 5];
    let vvv = &vv[1..];
    println!("vv : {:#?}", vv);
    let mut v1: Vec<i32> = Vec::new();
    v1.push(1);
    v1.push(2);
    v1.push(3);
    for i in &v1 {
        println!("{i}");
    }
    let ele1 = v1.pop(); // return Option enum
    if let Some(v) = ele1 {
        println!("{v}");
    }
    println!("v1 : {:#?}", v1);

    // this is a error prone
    let ele2 = &v1[1]; // immutable borrow
    // v1.push(20); // mutable borrow
    println!("{ele2}"); // error 

    // instead use .get() or .get_mut() method
    let ele2 = v1.get_mut(1);
    match ele2 {
        Some(v) => {
            *v += 1;
            println!("{v}")
        }
        None => println!("no value found"),
    }
    // vector can store only one type of data but,
    // we can store different data type using enum with diff-diff varients

    // #===================== Vec =====================#

    // [ ] #===================== String =====================#
    // In Rust String are stored as UTF-8 encoded bytes
    let s1 = String::new();
    let s2 = "intial content";
    let s3 = s2.to_string();
    let s4 = String::from("intial content");

    let s1 = String::from("Hello ");
    let s2 = String::from("World");
    let s3 = s1 + &s2;
    // println!("s1: {}", s1); // s1 is moved to s3 and can no longer be used
    println!("{} {}", s2, s3);

    // we can't access the char by index
    // let ch = &s3[2];
    // why is that, becaz string is a collection of bytes,
    // and what is the lenth of the bytes here,
    // it is not fixed, it can be 1, 2, 3, 4 bytes in size

    let ss = String::from("नमस्ते");
    for b in ss.bytes() {
        print!("{b} "); // 224 164 168 224 164 174 224 164 184 224 165 141 224 164 164 224 165 135 
    }
    println!();

    for c in ss.chars() {
        print!("{c} "); // न म स  ् त  े 
    }
    println!();
    // there is one more way which is `Grapheme Cluster` to print like this => [न म स् ते]
    // for this you need to add crate named => unicode-segmentation

    // #===================== String =====================#

    // [ ] #===================== HashMap =====================#
    let mut mp: HashMap<String, u32> = HashMap::new();
    mp.insert(String::from("Blue"), 10);
    mp.insert(String::from("Yellow"), 20);

    // .get() | .get_mut()
    let team_name = String::from("Blue");
    let score = match mp.get(&team_name) {
        Some(value) => value,
        None => {
            println!("No score found for {}", team_name);
            &0
        }
    };
    println!("Score: {}", score);

    // loop
    for (k, v) in &mp {
        println!("{k} : {v}");
    }

    // update
    mp.entry(String::from("Red")).or_insert(0); // if not found then insert with value 0
    let score = mp.entry(String::from("Blue")).or_insert(0); // if found then doesb't insert any thing but return the mutable refrence
    *score += 5;
    println!("{:#?}", mp);

    // example 
    let text = "The rain fell. It fell hard. It fell relentlessly, a steady drumming on the roof and a relentless torrent against the windowpanes. It fell all night, and it fell all day, a constant reminder of the storm outside.";
    let mut map = HashMap::new();
    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);
        *count += 1;
    }
    println!("{:#?}", map);

    // #===================== HashMap =====================#
}
