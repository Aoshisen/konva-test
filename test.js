var a = 1;
{
//1.执行之前这里的a（局部） 是function 全局的a是1；
  a = 100;
  function a() {}
//2.执行到这里的时候全局的a是100，局部的a是100
  a = 10;
  function a() {}
  //3. 执行到这里之前我们全局的a是10，局部的a是10
  a = 1;
  //4.执行到这里之前全局的a是10，局部的a是1
  a = 2;
// 5.执行到这里全局的a是10，局部的a是2
  console.log(a, "-----");
}

console.log(a, "=====");