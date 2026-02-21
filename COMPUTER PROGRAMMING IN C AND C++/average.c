#include <stdio.h>

int main(void) {
	int m1,m2,m3;
	printf("ENTER THE MARKS OF ANY 3 SUBJECTS: ");
	scanf("%d %d %d",&m1,&m2,&m3);
	int avr=(m1+m2+m3)/3;
	printf("THE AVERAGE MARKS OF THE GIVEN SUBJECTS IS: %d",avr);
}
