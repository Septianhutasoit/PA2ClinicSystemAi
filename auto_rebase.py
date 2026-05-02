import os
import sys
import subprocess

script_dir = os.path.abspath('.').replace('\\\\', '/')

seq_editor = os.path.join(script_dir, 'seq_editor.py').replace('\\\\', '/')
with open(seq_editor, 'w') as f:
    f.write('''import sys
with open(sys.argv[1], 'r') as f: lines = f.readlines()
new_lines = []
for line in lines:
    if line.startswith('pick'):
        parts = line.split(' ', 2)
        if len(parts) == 3:
            msg = parts[2].lower()
            bad = ['meluncur', 'mhm', 'skaada', 'oalah', 'gibrun', 'solo', 'asd', 'joko', 'prabo', 'run', 'yntkts', 'nofix', 'fixdata', 'addroledokter', 'addsttings', 'fixgool', 'sawitdb', 'q', 'sd', '.', 'hey an take', 'gibb run']
            if any(b in msg for b in bad) or msg.strip() == 'push' or msg.strip() == '-':
                new_lines.append(f'reword {parts[1]} {parts[2]}')
                continue
    new_lines.append(line)
with open(sys.argv[1], 'w') as f: f.writelines(new_lines)
''')

msg_editor = os.path.join(script_dir, 'msg_editor.py').replace('\\\\', '/')
with open(msg_editor, 'w') as f:
    f.write('''import sys
with open(sys.argv[1], 'r') as f: lines = f.readlines()
if not lines:
    sys.exit(0)
old_msg = lines[0].lower().strip()
mapping = {
    'meluncur': 'chore: update requirements and frontend app',
    'mhm': 'chore: update app environment',
    'skaada': 'feat: add admin schedules basic layout',
    'oalah': 'fix: update clinic endpoints configuration',
    'gibrunnn': 'feat: update schema models UI and logic',
    'solo': 'chore: cleanup api endpoints',
    'asd': 'feat: add medical records views',
    'joko': 'feat: add schedules manager for doctors',
    'addroledokter': 'feat: implement doctor role access',
    'prabo': 'feat: improve doctor dashboard and layout styling',
    'run': 'chore: update layouts',
    'gibrunn': 'fix: update auth and user models',
    'addsttings': 'feat: enable admin system settings',
    'yntkts': 'chore: refresh db session models',
    'nofix': 'feat: integrate admin patients table view',
    'fixdata': 'fix: strict appointment schema formatting',
    'adminjoko': 'feat: redesign admin components',
    'fixgool': 'fix: refine charts data fetch endpoints',
    'gibb runnn': 'chore: upload dummy sample images for products',
    'sawitdb': 'chore: database index performance adjustments',
    'q': 'chore: apply quick UI patch',
    'sd': 'chore: apply minor application updates',
    '.': 'chore: align files to patterns',
    'hey an take': 'chore: source code modifications',
    'prabo go': 'chore: UI references styling changes',
    'gib run': 'chore: framework standard internal updates',
    '-': 'chore: update system dependencies'
}
new_msg = 'chore: minor updates to files'
for k, v in mapping.items():
    if k in old_msg:
        new_msg = v
        break
lines[0] = new_msg + '\\n'
with open(sys.argv[1], 'w') as f: f.writelines(lines)
''')

env = os.environ.copy()
env['GIT_SEQUENCE_EDITOR'] = r'"' + sys.executable + r'" "' + seq_editor + r'"'
env['GIT_EDITOR'] = r'"' + sys.executable + r'" "' + msg_editor + r'"'

print('Starting rebase...')
res = subprocess.run(['git', 'rebase', '-i', '1b21f67'], env=env, capture_output=True, text=True)
print('STDOUT:')
print(res.stdout)
print('STDERR:')
print(res.stderr)
if res.returncode == 0:
    print('Rebase completed successfully.')
else:
    print('Rebase failed.')
