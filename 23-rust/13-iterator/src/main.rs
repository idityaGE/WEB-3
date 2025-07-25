#[test]
fn iterator_demo() {
    let v1 = vec![1, 2, 3];
    let mut v1_iter = v1.iter(); // if you want mutable refrence, use .iter_mut()
    // and if you want owned type, use .into_iter();
    assert_eq!(v1_iter.next(), Some(&1)); // this is a immutable reference
    assert_eq!(v1_iter.next(), Some(&2));
    assert_eq!(v1_iter.next(), Some(&3));
    assert_eq!(v1_iter.next(), None);
}

// iterator have various method defined on its.
// they are in two category Adaptor and Consumer
// Adaptor -> Take an iterator and return another iterator
// Consumer -> Take an iterator and return some another type

#[test]
fn iterator_sum() { 
    let v1 = vec![1, 2, 3];
    let v1_iter = v1.iter();
    let total: i32 = v1_iter.sum();
    assert_eq!(total, 6);
}

// pub trait Iterator {
//     type Item; // associated type
//     fn next(&mut self) -> Option<Self::Item>;
// }

struct Counter {
    count: u32,
}

impl Counter {
    fn new() -> Counter {
        Counter { count: 0 }
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.count < 5 {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}

#[test]
fn test_counter() {
    let mut c = Counter::new();
    assert_eq!(c.next(), Some(1));
    assert_eq!(c.next(), Some(2));
    assert_eq!(c.next(), Some(3));
    assert_eq!(c.next(), Some(4));
    assert_eq!(c.next(), Some(5));
    assert_eq!(c.next(), None);
}

#[test]
fn using_other_iterator_trait_method() {
    let sum: u32 = Counter::new()
        .zip(Counter::new().skip(1))
        .map(|(a, b)| a * b)
        .filter(|x| x % 3 == 0)
        .sum();
    assert_eq!(18, sum);
}

fn main() {
    let v1 = vec![1, 2, 3, 4, 5];
    let v1_iter = v1.iter(); // in rust iterator are lazy and nothing happend until we call next on it.

    for value in v1_iter {
        println!("Got {}", value);
    }

    // Adaptor
    let v2 = vec![1, 2, 3];
    // this map also return an iterator, which is lazy
    let v3: Vec<_> = v2.iter().map(|x| *x + 1).collect();
    println!("new : {:?}", v3);

    let v4 = vec![2, 5, 3, 7, 8, 2];
    let evens: Vec<_> = v4.into_iter().filter(|val| val % 2 == 0).collect();
    println!("new one {:?}", evens);
}
