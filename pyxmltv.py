#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import os
import json
from xml.etree import ElementTree
import sys
import io
import zipfile

# Fichiers de mots-clés
FICHIER_PERSO = 'perso_xmltv.py'
FICHIER_DEFAUT = 'defaut_xmltv.py'

def lire_mots_cles(fichier):
    if os.path.exists(fichier):
        with open(fichier, 'r', encoding='utf-8') as f:
            content = f.read()
            return eval(content)
    return {}

def parser_xmltv(xml_content):
    root = ElementTree.fromstring(xml_content)

    channels_data = []
    for channel_element in root.findall('channel'):
        channel_id = channel_element.get('id')
        channel_name = channel_element.find('display-name').text if channel_element.find('display-name') is not None else 'Nom inconnu'
        channel_logo = channel_element.find('icon').get('src') if channel_element.find('icon') is not None and channel_element.find('icon').get('src') else None

        programs = []
        for programme_element in root.findall(f'.//programme[@channel="{channel_id}"]'):
            program_id = programme_element.get('start')
            program_title = programme_element.find('title').text if programme_element.find('title') is not None else 'Titre inconnu'
            program_description = programme_element.find('desc').text if programme_element.find('desc') is not None else None
            program_vignette = programme_element.find('icon').get('src') if programme_element.find('icon') is not None and programme_element.find('icon').get('src') else None
            program_summary = programme_element.find('sub-title').text if programme_element.find('sub-title') is not None else None


            programs.append({
                'id': program_id,
                'time': program_id, # À modifier pour extraire l'heure correctement
                'title': program_title,
                'description': program_description,
                'vignette': program_vignette,
                'summary': program_summary,
            })

        channels_data.append({
            'id': channel_id,
            'name': channel_name,
            'logo': channel_logo,
            'programs': programs
        })

    return channels_data

def afficher_resultats_json(resultats):
    print(json.dumps(resultats, indent=2))

def main():
    parser = argparse.ArgumentParser(description="Parser XMLTV pour extraire les informations des chaines et programmes en JSON.")
    parser.add_argument('-j', '--json', action='store_true', help='Afficher les résultats en JSON')
    parser.add_argument('-v', '--version', action='store_true', help='Version')
    args = parser.parse_args()

    if args.version:
        print("pyxmltv v1.8") # Mise à jour de la version
        return

    xml_content_bytes = sys.stdin.buffer.read()
    xml_content = xml_content_bytes.decode('utf-8')

    if xml_content:
        channels_data = parser_xmltv(xml_content)
        if args.json:
            afficher_resultats_json(channels_data)
        else:
            print("Utilisez l'option --json pour afficher les résultats en JSON.")

if __name__ == '__main__':
    main()
