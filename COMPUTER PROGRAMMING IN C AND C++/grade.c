//WAP TO IPT THE MARKS OF A STUDENT IN THREE SUBJECTS CALCULATE THE PERCENTAGE AND DISPLAY THE GRADE ACCORDING TO THE PERCENTAGE.
//IF 80-90 THEN A+ GRADE
//IF ABOVE 90 THEN O GRADE
//IF BETWEEN 70-80 THEN A GRADE
#include <stdio.h>
int main()
{
	float math,phy,comp;
	printf("ENTER YOUR MARKS IN MATHEMATICS: ");
	scanf("%f",&math);
	printf("ENTER YOUR MARKS IN COMPUTER APPLICATIONS: ");
	scanf("%f",&comp);
	printf("ENTER YOUR MARKS IN PHYSICS: ");
	scanf("%f",&phy);
	float perc=((math+phy+comp)*100)/300;
	if(perc>=90 && perc<100)
	{
		printf("GRADE: O");
	}else if (perc>=80 && perc<90)
	{
		printf("GRADE: A+");
	}else if (perc>=70 && perc<80)
	{
		printf("GRADE: A");
	}else if (perc>=60 && perc<70)
	{
		printf("GRADE: B+");
	}else 
	{
		printf("GRADE: B");
	}
	return 0;
}
