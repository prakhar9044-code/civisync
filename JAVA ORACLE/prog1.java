import java.util.Scanner;
public class prog1{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);
        int a,b,sum;
        System.out.println("Enter the First Number: ");
        a=sc.nextInt();
        System.out.println("Enter the Second Number: ");
        b=sc.nextInt();
        sum=a+b;
        System.out.println("The sum of "+a+ " and "+ b+ " is: "+sum);
    }
}