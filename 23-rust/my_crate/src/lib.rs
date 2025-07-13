//! My crate
//!
//! `my_crate` is a collection of useless utilities to make your life hard.
//! fuck off

/// ## Add one to given number.
///
/// ### Example:
///
/// ```
/// let arg = 5;
/// let answer = my_crate::add_one(arg);
///
/// assert_eq!(6, answer);
/// ```
pub fn add_one<T: std::ops::Add<i32, Output = T>>(x: T) -> T {
    x + 1
}

// pub use self::kinds::PrimaryColor;
// pub use self::kinds::SecondaryColor;
// pub use self::utils::mix;

// pub mod kinds {
//     /// The primary colors according to the RYB color model.
//     pub enum PrimaryColor {
//         Red,
//         Yellow,
//         Blue,
//     }

//     /// The secondary colors according to the RYB color model.
//     pub enum SecondaryColor {
//         Orange,
//         Green,
//         Purple,
//     }
// }

// pub mod utils {
//     use my_crate::kinds::*;

//     /// Combines two primary colors in equal amounts to create
//     /// a secondary color.
//     pub fn mix(c1: PrimaryColor, c2: PrimaryColor) -> SecondaryColor {
//         // --snip--
//     }
// }
