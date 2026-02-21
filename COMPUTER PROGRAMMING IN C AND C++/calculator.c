//design a basic calculator using switch
#include <stdio.h>
int main()
{
	int choice,a,b;
	printf("SELECT TASK AND ENTER CHOICE: \n 1 FOR ADDITION (+) \n 2 FOR MULTIPLICATION (x) \n 3 FOR SUBTRACTION (-) \n 4 FOR DIVISION (/) \n 5 FOR SQUARE (*) \n 6 FOR MODULUS(%)");
	printf("\n\nENTER YOUR CHOICE: ");
	scanf("%d",&choice);
	printf("\nENTER ANY TWO NUMBERS TO PROCEED: ");
	scanf("%d %d",&a,&b);
	switch(choice) {
		case 1:
			printf("THE SUM IS: a+b=%d",a+b);
			break;
	 	case 2:
	 		printf("THE PRODUCT IS: axb=%d",a*b);
	 		break;
	 	case 3:
	 		printf("THE DIFFERENCE IS: a-b=%d",a-b);
	 		break;
	 	case 4:
	 		printf("THE QUOTIENT IS: a/b=%d",a/b);
	 		break;
	 	case 5:
	 		printf("THE SQUARE IS: a*a=%d",a*a);
	 		break;
	 	case 6:
	 		printf("THE REMAINDER IS: a%b=%d",a%b);
	 		break;
	 	default:
	 		printf("INVALID CHOICE ENTERED !");
	}
}
