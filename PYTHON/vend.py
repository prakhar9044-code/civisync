# Grocery Vending Machine in Python

# Available items in the vending machine (item: price)
grocery_items = {
    "Rice (1kg)": 60,
    "Wheat Flour (1kg)": 45,
    "Sugar (1kg)": 40,
    "Cooking Oil (1L)": 150,
    "Milk (1L)": 55,
    "Bread (1 loaf)": 30,
    "Eggs (6 pcs)": 50,
    "Salt (1kg)": 20,
    "Tea (250g)": 120,
    "Coffee (100g)": 90
}

def display_items():
    print("\n--- Grocery Vending Machine ---")
    for i, (item, price) in enumerate(grocery_items.items(), 1):
        print(f"{i}. {item} - ₹{price}")

def vending_machine():
    balance = float(input("\n💰 Enter the amount of money you have: ₹"))
    cart = []

    while True:
        display_items()
        choice = input("\nSelect item number to buy (or 'q' to quit): ")

        if choice.lower() == 'q':
            break

        if choice.isdigit() and 1 <= int(choice) <= len(grocery_items):
            item = list(grocery_items.keys())[int(choice) - 1]
            price = grocery_items[item]

            if balance >= price:
                balance -= price
