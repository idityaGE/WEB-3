pub trait Draw {
    fn draw(&self);
}

pub struct Screen {
    pub components: Vec<Box<dyn Draw>>, // dyn means dynamic dispatch, it will be figure out the type at runtime
}

impl Screen {
    pub fn run(&self) {
        for compnent in self.components.iter() {
            compnent.draw();
        }
    }
}

// pub struct Screen<T: Draw> {
//   // the problem in this approch is that it can store only one type at a time
//   // but in dynamic dispatch it can store any type which impl Draw trait
//   // TLDR; it can't store mixture of these types
//     pub components: Vec<T>,
// }

// impl<T> Screen<T>
// where
//     T: Draw,
// {
//     pub fn run(&self) {
//         for compnent in self.components.iter() {
//             compnent.draw();
//         }
//     }
// }

pub struct Button {
    pub width: u32,
    pub height: u32,
    pub lable: String,
}

impl Draw for Button {
  fn draw(&self) {
      // draw here
  }
}
