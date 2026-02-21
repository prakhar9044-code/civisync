import java.util.Scanner;
public class average{
    public static void main(String[] args)
    {
        Scanner sc=new Scanner(System.in);
        int a,b,avg;
        System.out.println("ENTER THE FIRST NUMBER: ");
        a=sc.nextInt();
        System.out.println("ENTER THE SECOND NUMBER: ");
        b=sc.nextInt();
        avg=(a+b)/2;
        System.out.println("THE AVERAGE OF THE PROVIDED NUMBERS ARE: "+avg);
    }
}