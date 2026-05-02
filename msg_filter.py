import sys

msg = sys.stdin.read()
original_msg_lower = msg.lower()

mapping = {
    'meluncur': 'chore: update requirements and frontend app',
    'mhm': 'chore: update app environment',
    'skaada': 'feat: add admin schedules basic layout',
    'oalah': 'fix: update clinic endpoints configuration',
    'gibrunnn': 'feat: update schema models UI and logic',
    'solo': 'chore: cleanup api endpoints',
    'asd': 'feat: add medical records views',
    'jokouiii': 'feat: add schedules manager for doctors',
    'addroledokter': 'feat: implement doctor role access',
    'prabogoo': 'feat: improve doctor dashboard and layout styling',
    'prabo': 'feat: update doctor refs',
    'gibrunn': 'fix: update auth and user models',
    'addsttings': 'feat: enable admin system settings',
    'yntkts': 'chore: refresh db session models',
    'nofix': 'feat: integrate admin patients table view',
    'fixdata': 'fix: strict appointment schema formatting',
    'adminjokoui': 'feat: redesign admin components',
    'fixgool': 'fix: refine charts data fetch endpoints',
    'sawitdb': 'chore: database index performance adjustments',
    'hey an take': 'chore: source code modifications'
}

exact_map = {
    'run\n': 'chore: update layouts\n',
    'q\n': 'chore: apply quick UI patch\n',
    'sd\n': 'chore: apply minor application updates\n',
    '.\n': 'chore: align files to patterns\n',
    'push\n': 'chore: trigger deployment push\n',
    '-\n': 'chore: update system dependencies\n',
    'run': 'chore: update layouts',
    'gibb runnn': 'chore: add dummy sample images',
    'gib run': 'chore: framework standard internal updates',
}

new_msg = msg
for k, v in exact_map.items():
    if msg.lower().strip() == k.strip():
        new_msg = v
        break

if new_msg == msg:
    for k, v in mapping.items():
        if k in original_msg_lower:
            new_msg = v + '\n'
            break

print(new_msg, end='')
