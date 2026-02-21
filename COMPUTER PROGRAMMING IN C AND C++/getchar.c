#include <stdio.h>
int main()
{
	char c;
	printf("ENTER ANY CHARACTER: ");
	c=getchar();
	printf("THE CHARACTER YOU GAVE IS: %c",c);
	return 0;
}
//IF YOU GIVE MORE THAN ONE CHARACTER AS INPUT IN GETCHAR THEN IT WILL DISPLAY ONLY THE FIRST ONE INSTEAD OF AN ERROR.
