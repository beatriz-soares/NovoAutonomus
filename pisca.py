from plugin import Plugin
from pyglui import ui
from collections import deque
from itertools import islice
import numpy as np
import math
import logging
logger = logging.getLogger(__name__)


class Deteccao_Pisca(Plugin):
    """
    Esse plugin inplementa um deteção de piscada do olho
    """
    order = .8

    def __init__(self, g_pool):
        super(Deteccao_Pisca, self).__init__(g_pool)
        self.history_length_per_fps = 0.2

        self.tamanho_historico = 20
        self.confianca_piscada = 0.9
        self.tempo_minimo = 0.5

        # The maximum length of the history needs to be set a priori. If we are assuming a maximum frame rate of 120 FPS
        # and a generous maximum onset duration of a blink of 0.5 seconds, 60 frames of history should always be enough
        self.confidence_histories = (deque(maxlen=self.tamanho_historico), deque(maxlen=self.tamanho_historico))
        self.timestamp_histories = (deque(maxlen=self.tamanho_historico), deque(maxlen=self.tamanho_historico))
        self.eyes_are_alive = g_pool.eyes_are_alive

        self.iniciou_piscada = False

        self.is_blink = False
        self.menu = None

    def init_gui(self):
        self.menu = ui.Growing_Menu('Detector de piscada')
        self.g_pool.sidebar.append(self.menu)
        self.menu.append(ui.Info_Text('Esse plugin detecta a piscada do olho.'))
        self.menu.append(ui.Slider('tamanho_historico', self, min=1.0, max=100.0))
        self.menu.append(ui.Slider('confianca_piscada', self, min=0.5, max=1.0))
        self.menu.append(ui.Slider('tempo_minimo', self, min=0.5, max=4.0))
        self.menu.append(ui.Button('Fechar', self.close))

    def deinit_gui(self):
        if self.menu:
            self.g_pool.sidebar.remove(self.menu)
            self.menu = None

    def close(self):
        self.alive = False

    def cleanup(self):
        self.deinit_gui()

    def update(self, frame=None, events={}):
        # backwards compatibility
        self.recent_events(events)

    def recent_events(self, events={}):

        # Process all pupil_positions events
        for pt in events.get('pupil_positions', []):
            # Update history

            if len(self.confidence_histories[pt['id']]) > self.tamanho_historico:
                self.confidence_histories[pt['id']].popleft()

            if len(self.timestamp_histories[pt['id']]) > self.tamanho_historico:
                self.timestamp_histories[pt['id']].popleft()


            self.confidence_histories[pt['id']].appendleft(pt['confidence'])
            self.timestamp_histories[pt['id']].appendleft(pt['timestamp'])

            # Enquanto não tiver o mínimo de amostras não faz nada
            if len(self.timestamp_histories[pt['id']]) < self.tamanho_historico:
                continue
            else:
                fps = self.tamanho_historico * 1.0 / (
                    self.timestamp_histories[pt['id']][0] - self.timestamp_histories[pt['id']][self.tamanho_historico-1]
                )
                # fps = 120
                self.history_length = int(self.history_length_per_fps * fps)

            terminou_piscada = False
            tempo = 0

            if len(self.eyes_are_alive) > 0 and self.eyes_are_alive[0].value:
                if np.mean(self.confidence_histories[0]) <= 1 - self.confianca_piscada and not self.iniciou_piscada:
                    self.iniciou_piscada = True
                    logger.info("Fechou o olho")
                    self.timestamp_inicio_piscada = self.timestamp_histories[pt['id']][0]
                elif np.mean(self.confidence_histories[0]) > 1 - self.confianca_piscada and self.iniciou_piscada:
                    terminou_piscada = True
                    self.iniciou_piscada = False
                    logger.info("Abriu o olho")
                    tempo = self.timestamp_histories[pt['id']][0] - self.timestamp_inicio_piscada

            # logger.debug('{}'.format(self.iniciou_piscada))
            #
            # Add info to events
            if terminou_piscada and tempo >= self.tempo_minimo:
                logger.info(tempo)
                blink_entry = {
                    'topic': 'blink',
                    'tempo': tempo,
                }

                if 'blinks' not in events:
                    events['blinks'] = []
                    events['blinks'].append(blink_entry)

            # # Combine activations if we are binocular
            # if self.eyes_are_alive[0].value and self.eyes_are_alive[1].value:
            #     act = np.maximum(act0, act1)
            # elif self.eyes_are_alive[0].value:
            #     act = act0
            # elif self.eyes_are_alive[1].value:
            #     act = act1
            # else:
            #     return
            #
            # # Judge if activation is sufficient for the on-set of a blink
            # if not self.is_blink and act > 0.4:
            #     logger.error("Blink")
            #     self.is_blink = True
            #
            # # If we also want to measure the off-set of a blink we could do it like this
            # if self.is_blink and act < -0.1:
            #     self.is_blink = False
            #
            # logger.debug('{} {}'.format(self.is_blink, act))
            #
            # # Add info to events
            # blink_entry = {
            #     'topic': 'blink',
            #     'activation': act,
            #     'timestamp': self.timestamp_histories[pt['id']][int(math.ceil(self.history_length / 2.0))],
            #     'is_blink': self.is_blink
            # }
            #
            # if 'blinks' not in events:
            #     events['blinks'] = []
            # events['blinks'].append(blink_entry)

    def get_init_dict(self):
        return {}
