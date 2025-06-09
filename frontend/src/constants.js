export const LANGUAGE_VERSIONS = {
  cpp: {
    id: 76,
    version: "GCC 14.1.0"
  },
  java: {
    id: 62,
    version: "JDK 17.0.6"
  },
  python: {
    id: 100,
    version: "3.12.5"
  },
  c: {
    id: 104,
    version: "Clang 18.1.8"
  },
  javascript: {
    id: 102,
    version: "Node.js 22.08.0"
  },
  rust: {
    id: 73,
    version: "1.40.0"
  }
};

export const CODE_SNIPPETS = {
  javascript: `function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Alex");
`,
  python: `def greet(name):
  print("Hello, " + name + "!")

greet("Alex")
`,
  java: `public class Main {
  public static void main(String[] args) {
    //write your code here
  }
}
`,
  cpp: `#include <iostream>

int main() {
  std::cout << "Hello, World!" << std::endl;
  return 0;
}
`,
  rust: `fn main() {
  println!("Hello, World!");
}
`,
  c: `#include <stdio.h>

int main() {
  printf("Hello, World!\\n");
  return 0;
}
`
};
