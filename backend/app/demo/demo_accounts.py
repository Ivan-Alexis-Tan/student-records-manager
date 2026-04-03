def get_roles_and_ids() -> dict:
    result = {}

    for account in demo_accounts:
        result[account['role']] = account['id']

    return result


demo_accounts = [
    {
        "id": "a622bef9-4b81-45f4-8a4d-7a4a2c8a4f54", 
        "role": "admin", 
        "username": "Admin Demo",
        "email": "admin.demo@gmail.com",
        "password": "admin123",
    },
    {
        "id": "fd0741c8-b7d6-4e6e-8869-0bec5898a8a1", 
        "role": "teacher", 
        "username": "Teacher Demo",
        "email": "teacher.demo@gmail.com",
        "password": "teacher123",
    },
    {
        "id": "134730e0-efb7-4f73-b8dd-482261dccfa4", 
        "role": "student", 
        "username": "Student Demo",
        "email": "student.demo@gmail.com",
        "password": "student123",
    },
]

admin_demo_acc = demo_accounts[0]
teacher_demo_acc = demo_accounts[1]
student_demo_acc = demo_accounts[2]
demo_roles_and_ids = get_roles_and_ids()
ids_list = [val for _, val in demo_roles_and_ids.items()]