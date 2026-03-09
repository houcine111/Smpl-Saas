import json
import os

path = r'c:\Users\aitbe\OneDrive\Bureau\Saas\mini-shop\testsprite_tests\testsprite_frontend_test_plan.json'

with open(path, 'r', encoding='utf-8') as f:
    plan = json.load(f)

for tc in plan:
    tc_id = tc.get('id', '')
    category = tc.get('category', '').lower()
    title = tc.get('title', '').lower()
    
    # Logic: Admin tests use admin credentials. 
    # TC022 is a negative test for vendor on admin route.
    is_admin_test = ('admin' in category or 'admin' in title) and 'non-admin' not in title
    
    user = 'aitbenlihoucine14@gmail.com' if is_admin_test else 'aitbenalihoucine18@gmail.com'
    password = 'houcine houcine' if is_admin_test else 'Houcine18'
    
    if 'steps' in tc:
        for step in tc['steps']:
            if 'description' in step:
                # First restore placeholders if they were replaced partially or keep it clean
                # Actually my script above already replaced them. So I replace both potentials.
                step['description'] = step['description'].replace('aitbenlihoucine14@gmail.com', user)
                step['description'] = step['description'].replace('houcine houcine', password)
                step['description'] = step['description'].replace('aitbenalihoucine18@gmail.com', user)
                step['description'] = step['description'].replace('Houcine18', password)
                # And handle the original placeholders just in case
                step['description'] = step['description'].replace('{{LOGIN_USER}}', user)
                step['description'] = step['description'].replace('{{LOGIN_PASSWORD}}', password)

with open(path, 'w', encoding='utf-8') as f:
    json.dump(plan, f, indent=2, ensure_ascii=False)

print("Successfully refined test plan credentials.")
