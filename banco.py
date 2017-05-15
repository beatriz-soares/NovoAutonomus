# coding:utf-8
"""Script para criação do banco de dados provisório em sqlite3.
"""

import sqlite3

conn = sqlite3.connect("model/autonomus.db")
cursor = conn.cursor()

#
# sql = "DROP TABLE IF EXISTS cadeia_palavras;"
# cursor.execute(sql)
#
# sql = """
# CREATE TABLE palavras
# (
#   id integer not null primary key autoincrement,
#   palavra character varying,
#   ocorrencias integer
# )
# """
# cursor.execute(sql)
#
# sql = """
# CREATE TABLE cadeia_palavras
# (
#   primaria_id integer,
#   secundaria_id integer,
#   hora_ocorrencia DATETIME DEFAULT CURRENT_TIMESTAMP
# )
# """
# cursor.execute(sql)

conn.commit()
conn.close()
