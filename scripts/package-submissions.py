#!/usr/bin/env python3
"""Build deterministic submission ZIPs from scoped source, never working caches."""
import argparse
import io
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_SKILLS = ('persona-builder', 'persona-framework', 'persona-ontology',
                 'persona-data-feeds', 'persona-signals', 'persona-playbooks', 'persona-roi')
ONTOLOGY_FILES = ('SKILL.md', 'references/contract.md', 'references/ontology.schema.json',
                  'references/persona-framework.md', 'scripts/validate-ontology.cjs',
                  'scripts/ontology.cjs', 'scripts/context-selection.cjs')
EXCLUDED = {'.git', 'node_modules', '__pycache__', '.DS_Store', '.sites-runtime'}


def files(folder):
    for path in sorted(folder.rglob('*')):
        if path.is_file() and not any(part in EXCLUDED for part in path.relative_to(folder).parts):
            yield path


def archive(contents):
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as output:
        for name, data in sorted(contents.items()):
            info = zipfile.ZipInfo(name, (2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            output.writestr(info, data)
    return buffer.getvalue()


def packages():
    manifest = (ROOT / 'openai-submission/plugin.json').read_bytes()
    version = json.loads(manifest)['version']
    public = {'gabriel-operator/.codex-plugin/plugin.json': manifest}
    for name in PUBLIC_SKILLS:
        folder = ROOT / 'skills-openai' / name
        paths = [folder / rel for rel in ONTOLOGY_FILES] if name == 'persona-ontology' else files(folder)
        for path in paths:
            public[f'gabriel-operator/skills/{name}/{path.relative_to(folder).as_posix()}'] = path.read_bytes()
    for name in ('icon.png', 'logo.png'):
        public[f'gabriel-operator/assets/{name}'] = (ROOT / 'assets' / name).read_bytes()
    # Standalone Claude Persona Builder retains its declared MCP setup and identity.
    builder = ROOT / 'skills/persona-builder'
    claude = {path.relative_to(builder).as_posix(): path.read_bytes() for path in files(builder)
              if not any(part in {'claude-submission', 'openai-submission'} for part in path.relative_to(builder).parts)}
    # Include the full framework specializations in the standalone Claude bundle.
    for name in PUBLIC_SKILLS[1:]:
        folder = ROOT / 'skills' / name
        for path in files(folder):
            claude[f'skills/{name}/{path.relative_to(folder).as_posix()}'] = path.read_bytes()
    return version, {
        'openai-submission/gabriel-operator-openai.zip': archive(public),
        'claude-submission/persona-builder.zip': archive(claude),
        'claude-submission/persona-builder.plugin': archive(claude),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    version, results = packages()
    for name, data in results.items():
        path = ROOT / name
        if args.check:
            if not path.is_file() or path.read_bytes() != data:
                raise SystemExit(f'Submission archive drift: {name}')
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
        with zipfile.ZipFile(io.BytesIO(data)) as output:
            assert output.testzip() is None
            print(f'{name}: {len(output.namelist())} files, version {version}')


if __name__ == '__main__':
    main()
