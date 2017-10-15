# coding:utf-8
"""Script para criação do banco de dados provisório em sqlite3.
"""

import sqlite3

conn = sqlite3.connect("model/autonomus.db")
cursor = conn.cursor()
# sql = """
# DROP TABLE Gestos
# """
# cursor.execute(sql)
#
# sql = """
# CREATE TABLE Gestos
# (
#   id integer not null primary key autoincrement,
#   gesto character varying,
#   nome_gif character varying
# )
# """
# cursor.execute(sql)
# sql = """INSERT INTO Gestos ("gesto", "nome_gif")
#    VALUES ("Piscar", "piscar")
#    """
# cursor.execute(sql)
#
# sql = """INSERT INTO Gestos ("gesto", "nome_gif")
#    VALUES ("Levantar a sobrancelha", "sobrancelha")
#    """
# cursor.execute(sql)
#
# sql = """INSERT INTO Gestos ("gesto", "nome_gif")
#    VALUES ("Franzir o nariz", "nariz")
#    """
# cursor.execute(sql)
#
# sql = """INSERT INTO Gestos ("gesto", "nome_gif")
#    VALUES ("Abrir a boca", "abrir_boca")
#    """
# cursor.execute(sql)
#
sql = """UPDATE Gestos SET nome_gif = 'muxoxo', gesto='Muxoxo' WHERE nome_gif='moxexo'"""
cursor.execute(sql)
#
# sql = "DROP TABLE IF EXISTS Frases;"
# cursor.execute(sql)
# sql = """
# CREATE TABLE Frases
# (
#   id integer not null primary key autoincrement,
#   frase character varying,
#   gesto int,
#   FOREIGN KEY (gesto) REFERENCES Gestos(gesto)
# )
# """
# cursor.execute(sql)
# sql = """INSERT INTO Frases ("frase", "gesto")
#    VALUES ("Ligue a TV", 1)
#    """
# cursor.execute(sql)
# sql = """INSERT INTO Frases ("frase","gesto")
#    VALUES ("Quero agua", 2)"""
# cursor.execute(sql)
#
# sql = """INSERT INTO Frases ("frase","gesto")
#      VALUES ("Eu sou Bia", 4)"""
# cursor.execute(sql)
# sql = """INSERT INTO Frases ("frase","gesto")
#      VALUES ("Eu sou Bia", 5)"""
# cursor.execute(sql)
sql = """UPDATE Gestos SET selecionado="checked";"""
cursor.execute(sql)
conn.commit()
conn.close()
