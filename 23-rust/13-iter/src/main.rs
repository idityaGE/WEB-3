fn main() {
    let v1 = vec![1, 2, 3];
    let mut v_iter = v1.iter();
    while let Some(i) = v_iter.next() {
        println!("{}", i);
    }
    println!("{:?}", v1);

    // if you use just v1 instead of &v1 then iterator will consume it `v1.into_iter()`
    for i in &v1 {
        println!("{}", i);
    }
    println!("{:?}", v1);

    let v2 = vec![1, 2, 3];
    let mut v2_iter = v2.into_iter();
    // Consuming adapters - sum and count
    let s_v2: i32 = v2_iter.clone().sum(); // sum will consume, that's why clone is added
    println!("{s_v2}");
    while let Some(i) = v2_iter.next() {
        println!("{}", i);
    }
    // println!("{:?}", v2);

    // Iterator adapter
    let v3 = vec![1, 2, 3];
    let v3_iter = v3.into_iter();
    let v2: Vec<i32> = v3_iter.map(|x| x + 1).collect();
    println!("{:?}", v2);
    // while let Some(i) = v3_iter.next() {
    //     println!("{}", i);
    // }

    let test_vec = vec![1, 5, 2, 5, 2, 8, 3, 24, 2];
    let ele = find_element(&test_vec, 24);
    match ele {
        Some(i) => println!("{:?} Found {}", test_vec, *i),
        None => println!("Not found"),
    }
}

fn find_element<T: std::cmp::PartialEq>(vec: &Vec<T>, item: T) -> Option<&T> {
    let mut vec_iter = vec.iter();
    while let Some(i) = vec_iter.next() {
        if item == *i {
            return Some(i);
        }
    }
    None
}
