# to replace the characters in a string.
letter= ''' Dear <|NAME|>,
            You are selected!
            <|DATE|>'''
print(letter.replace("<|NAME|>","PRAKHAR").replace("<|DATE|>","20th June 2024."))