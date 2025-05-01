import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, onValue, push, remove } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBuUAHfvWYwRSYdKNwZNaqy7gAWi9a0LIk",
  authDomain: "nossocalendario.firebaseapp.com",
  databaseURL: "https://nossocalendario-default-rtdb.firebaseio.com",
  projectId: "nossocalendario",
  storageBucket: "nossocalendario.firebasestorage.app",
  messagingSenderId: "243090846041",
  appId: "1:243090846041:web:9141b28ea5d83e3656dc48",
  measurementId: "G-4TWK5S2RMV"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentDate = new Date();
let selectedDays = {};
let datingDays = [6]; // Sábados
let specialDates = [];

// Lista de datas especiais (2025, 2026, 2027)
const specialDatesList = {
  holidays: [
    // 2025
    { date: "2025-01-01", name: "Confraternização Universal", class: "holiday" },
    { date: "2025-04-18", name: "Paixão de Cristo", class: "holiday" },
    { date: "2025-04-21", name: "Tiradentes", class: "holiday" },
    { date: "2025-05-01", name: "Dia Mundial do Trabalho", class: "holiday" },
    { date: "2025-09-07", name: "Independência do Brasil", class: "holiday" },
    { date: "2025-10-12", name: "Nossa Senhora Aparecida", class: "holiday" },
    { date: "2025-11-02", name: "Finados", class: "holiday" },
    { date: "2025-11-15", name: "Proclamação da República", class: "holiday" },
    { date: "2025-11-20", name: "Dia Nacional de Zumbi e da Consciência Negra", class: "holiday" },
    { date: "2025-12-25", name: "Natal", class: "holiday christmas" },
    // 2026
    { date: "2026-01-01", name: "Confraternização Universal", class: "holiday" },
    { date: "2026-04-03", name: "Paixão de Cristo", class: "holiday" },
    { date: "2026-04-21", name: "Tiradentes", class: "holiday" },
    { date: "2026-05-01", name: "Dia Mundial do Trabalho", class: "holiday" },
    { date: "2026-09-07", name: "Independência do Brasil", class: "holiday" },
    { date: "2026-10-12", name: "Nossa Senhora Aparecida", class: "holiday" },
    { date: "2026-11-02", name: "Finados", class: "holiday" },
    { date: "2026-11-15", name: "Proclamação da República", class: "holiday" },
    { date: "2026-11-20", name: "Dia Nacional de Zumbi e da Consciência Negra", class: "holiday" },
    { date: "2026-12-25", name: "Natal", class: "holiday christmas" },
    // 2027
    { date: "2027-01-01", name: "Confraternização Universal", class: "holiday" },
    { date: "2027-03-26", name: "Paixão de Cristo", class: "holiday" },
    { date: "2027-04-21", name: "Tiradentes", class: "holiday" },
    { date: "2027-05-01", name: "Dia Mundial do Trabalho", class: "holiday" },
    { date: "2027-09-07", name: "Independência do Brasil", class: "holiday" },
    { date: "2027-10-12", name: "Nossa Senhora Aparecida", class: "holiday" },
    { date: "2027-11-02", name: "Finados", class: "holiday" },
    { date: "2027-11-15", name: "Proclamação da República", class: "holiday" },
    { date: "2027-11-20", name: "Dia Nacional de Zumbi e da Consciência Negra", class: "holiday" },
    { date: "2027-12-25", name: "Natal", class: "holiday christmas" }
  ],
  commemorative: [
    // 2025
    { date: "2025-01-06", name: "Dia de Reis", class: "commemorative" },
    { date: "2025-01-20", name: "Dia de São Sebastião", class: "commemorative" },
    { date: "2025-02-02", name: "Dia de Iemanjá", class: "commemorative" },
    { date: "2025-03-08", name: "Dia Internacional da Mulher", class: "commemorative" },
    { date: "2025-04-01", name: "Dia da Mentira", class: "commemorative" },
    { date: "2025-04-19", name: "Dia dos Povos Indígenas", class: "commemorative" },
    { date: "2025-04-20", name: "Páscoa", class: "commemorative" },
    { date: "2025-05-11", name: "Dia das Mães", class: "commemorative" },
    { date: "2025-06-12", name: "Dia dos Namorados", class: "commemorative valentines" },
    { date: "2025-06-28", name: "Dia do Orgulho LGBTQIA+", class: "commemorative" },
    { date: "2025-07-26", name: "Dia dos Avós", class: "commemorative" },
    { date: "2025-08-10", name: "Dia dos Pais", class: "commemorative" },
    { date: "2025-08-11", name: "Dia do Estudante", class: "commemorative" },
    { date: "2025-09-21", name: "Dia da Árvore", class: "commemorative" },
    { date: "2025-10-12", name: "Dia das Crianças", class: "commemorative" },
    { date: "2025-10-15", name: "Dia do Professor", class: "commemorative" },
    { date: "2025-10-31", name: "Dia das Bruxas / Halloween", class: "commemorative" },
    { date: "2025-11-19", name: "Dia da Bandeira", class: "commemorative" },
    // 2026
    { date: "2026-01-06", name: "Dia de Reis", class: "commemorative" },
    { date: "2026-01-20", name: "Dia de São Sebastião", class: "commemorative" },
    { date: "2026-02-02", name: "Dia de Iemanjá", class: "commemorative" },
    { date: "2026-03-08", name: "Dia Internacional da Mulher", class: "commemorative" },
    { date: "2026-04-01", name: "Dia da Mentira", class: "commemorative" },
    { date: "2026-04-05", name: "Páscoa", class: "commemorative" },
    { date: "2026-04-19", name: "Dia dos Povos Indígenas", class: "commemorative" },
    { date: "2026-05-10", name: "Dia das Mães", class: "commemorative" },
    { date: "2026-06-12", name: "Dia dos Namorados", class: "commemorative valentines" },
    { date: "2026-06-28", name: "Dia do Orgulho LGBTQIA+", class: "commemorative" },
    { date: "2026-07-26", name: "Dia dos Avós", class: "commemorative" },
    { date: "2026-08-09", name: "Dia dos Pais", class: "commemorative" },
    { date: "2026-08-11", name: "Dia do Estudante", class: "commemorative" },
    { date: "2026-09-21", name: "Dia da Árvore", class: "commemorative" },
    { date: "2026-10-12", name: "Dia das Crianças", class: "commemorative" },
    { date: "2026-10-15", name: "Dia do Professor", class: "commemorative" },
    { date: "2026-10-31", name: "Dia das Bruxas / Halloween", class: "commemorative" },
    { date: "2026-11-19", name: "Dia da Bandeira", class: "commemorative" },
    // 2027
    { date: "2027-01-06", name: "Dia de Reis", class: "commemorative" },
    { date: "2027-01-20", name: "Dia de São Sebastião", class: "commemorative" },
    { date: "2027-02-02", name: "Dia de Iemanjá", class: "commemorative" },
    { date: "2027-03-08", name: "Dia Internacional da Mulher", class: "commemorative" },
    { date: "2027-03-28", name: "Páscoa", class: "commemorative" },
    { date: "2027-04-01", name: "Dia da Mentira", class: "commemorative" },
    { date: "2027-04-19", name: "Dia dos Povos Indígenas", class: "commemorative" },
    { date: "2027-05-09", name: "Dia das Mães", class: "commemorative" },
    { date: "2027-06-12", name: "Dia dos Namorados", class: "commemorative valentines" },
    { date: "2027-06-28", name: "Dia do Orgulho LGBTQIA+", class: "commemorative" },
    { date: "2027-07-26", name: "Dia dos Avós", class: "commemorative" },
    { date: "2027-08-08", name: "Dia dos Pais", class: "commemorative" },
    { date: "2027-08-11", name: "Dia do Estudante", class: "commemorative" },
    { date: "2027-09-21", name: "Dia da Árvore", class: "commemorative" },
    { date: "2027-10-12", name: "Dia das Crianças", class: "commemorative" },
    { date: "2027-10-15", name: "Dia do Professor", class: "commemorative" },
    { date: "2027-10-31", name: "Dia das Bruxas / Halloween", class: "commemorative" },
    { date: "2027-11-19", name: "Dia da Bandeira", class: "commemorative" }
  ],
  optional: [
    // 2025
    { date: "2025-03-03", name: "Carnaval", class: "optional" },
    { date: "2025-03-04", name: "Carnaval", class: "optional" },
    { date: "2025-03-05", name: "Quarta-feira de Cinzas", class: "optional" },
    { date: "2025-06-19", name: "Corpus Christi", class: "optional" },
    { date: "2025-10-28", name: "Dia do Servidor Público", class: "optional" },
    { date: "2025-12-24", name: "Véspera de Natal", class: "optional christmas" },
    { date: "2025-12-31", name: "Véspera de Ano Novo", class: "optional new-year-eve" },
    // 2026
    { date: "2026-02-16", name: "Carnaval", class: "optional" },
    { date: "2026-02-17", name: "Carnaval", class: "optional" },
    { date: "2026-02-18", name: "Quarta-feira de Cinzas", class: "optional" },
    { date: "2026-06-04", name: "Corpus Christi", class: "optional" },
    { date: "2026-10-28", name: "Dia do Servidor Público", class: "optional" },
    { date: "2026-12-24", name: "Véspera de Natal", class: "optional christmas" },
    { date: "2026-12-31", name: "Véspera de Ano Novo", class: "optional new-year-eve" },
    // 2027
    { date: "2027-02-08", name: "Carnaval", class: "optional" },
    { date: "2027-02-09", name: "Carnaval", class: "optional" },
    { date: "2027-02-10", name: "Quarta-feira de Cinzas", class: "optional" },
    { date: "2027-05-27", name: "Corpus Christi", class: "optional" },
    { date: "2027-10-28", name: "Dia do Servidor Público", class: "optional" },
    { date: "2027-12-24", name: "Véspera de Natal", class: "optional christmas" },
    { date: "2027-12-31", name: "Véspera de Ano Novo", class: "optional new-year-eve" }
  ]
};

// Função para converter DD/MM/YYYY para YYYY-MM-DD
function parseDate(input) {
  if (!input) return null;
  const parts = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (parts) {
    return `${parts[3]}-${parts[2]}-${parts[1]}`;
  }
  return input;
}

// Verificar se uma data é especial e retornar detalhes
function getSpecialDateDetails(dateKey) {
  for (const category of Object.values(specialDatesList)) {
    const match = category.find(item => item.date === dateKey);
    if (match) return { name: match.name, class: match.class };
  }
  return null;
}

// Renderizar Calendário
function renderCalendar() {
  try {
    console.log('Iniciando renderização do calendário');
    const monthYear = document.getElementById('month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid || !monthYear) {
      console.error('Elementos calendar-grid ou month-year não encontrados');
      return;
    }

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = firstDay.getDay();
    const month = currentDate.toLocaleString('pt-BR', { month: 'long' });
    monthYear.textContent = `${month} ${currentDate.getFullYear()}`;
    calendarGrid.innerHTML = '';

    console.log('Mês:', month, 'Ano:', currentDate.getFullYear());
    console.log('Dias no mês:', lastDay.getDate());
    console.log('Primeiro dia da semana:', startDay);

    // Dias da semana
    console.log('Adicionando dias da semana');
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    daysOfWeek.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.textContent = day;
      dayElement.className = 'font-bold text-lg';
      calendarGrid.appendChild(dayElement);
    });

    // Espaços vazios antes do primeiro dia
    console.log('Adicionando espaços vazios');
    for (let i = 0; i < startDay; i++) {
      calendarGrid.appendChild(document.createElement('div'));
    }

    // Dias do mês
    console.log('Adicionando dias do mês');
    const totalDays = lastDay.getDate();
    for (let day = 1; day <= totalDays; day++) {
      console.log('Renderizando dia:', day);
      const dayElement = document.createElement('div');
      dayElement.classList.add('calendar-day');
      dayElement.textContent = day;
      const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Adicionar legenda personalizada
      if (selectedDays[dateKey]) {
        dayElement.classList.add('has-legend');
      }

      // Adicionar marcação de encontro
      specialDates.forEach(item => {
        const meetingDate = parseDate(item.date);
        if (meetingDate === dateKey) {
          dayElement.classList.add('has-meeting');
        }
      });

      // Adicionar detalhes de feriado
      const specialDetails = getSpecialDateDetails(dateKey);
      if (specialDetails) {
        const classes = specialDetails.class.split(' ');
        classes.forEach(cls => dayElement.classList.add(cls));
        dayElement.title = specialDetails.name;
      }

      dayElement.addEventListener('click', () => {
        console.log('Dia clicado:', day, dateKey);
        showLegend(day, dateKey, specialDetails);
      });

      calendarGrid.appendChild(dayElement);
    }

    console.log('Total de dias renderizados:', totalDays);
    console.log('Atualizando contador');
    updateCountdown();
    console.log('Calendário renderizado com sucesso');
  } catch (error) {
    console.error('Erro ao renderizar calendário:', error);
  }
}

// Mostrar Legenda com Estilo Vintage
function showLegend(day, dateKey, specialDetails) {
  try {
    console.log('Abrindo legenda para dia:', day, dateKey);
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalContent.classList.add('vintage');
    modalTitle.textContent = `Dia ${day}`;
    let content = '';
    if (selectedDays[dateKey]) {
      content += `<p><strong>Legenda:</strong> ${selectedDays[dateKey]}</p>`;
    }
    if (specialDetails) {
      content += `<p><strong>Feriado/Data:</strong> ${specialDetails.name}</p>`;
    }
    modalBody.innerHTML = content || '<p>Nenhuma informação para este dia.</p>';
    modal.style.display = 'flex';
  } catch (error) {
    console.error('Erro ao mostrar legenda:', error);
  }
}

// Modal Personalizado
function openModal(type) {
  try {
    console.log('Abrindo modal:', type);
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    modalContent.classList.remove('vintage');

    switch (type) {
      case 'add-legend':
        modalTitle.textContent = 'Adicionar Legenda';
        modalBody.innerHTML = `
          <input type="text" id="legend-input" placeholder="Digite a legenda">
          <input type="number" id="day-input" placeholder="Dia (1-31)" min="1" max="31">
          <button id="save-legend">Salvar</button>
        `;
        break;
      case 'select-days':
        modalTitle.textContent = 'Selecionar Dias de Namoro';
        modalBody.innerHTML = `
          <select id="day-select" multiple size="7">
            <option value="0">Domingo</option>
            <option value="1">Segunda</option>
            <option value="2">Terça</option>
            <option value="3">Quarta</option>
            <option value="4">Quinta</option>
            <option value="5">Sexta</option>
            <option value="6" selected>Sábado</option>
          </select>
          <button id="save-dating-days">Salvar</button>
        `;
        break;
      case 'set-date':
        modalTitle.textContent = 'Definir Encontro Especial';
        modalBody.innerHTML = `
          <input type="text" id="date-input" placeholder="Data (ex: 23/04/2025)">
          <input type="text" id="time-input" placeholder="Hora (ex: 20:00)">
          <select id="type-input">
            <option value="Piquenique">Piquenique</option>
            <option value="Jantar">Jantar</option>
            <option value="Shopping">Shopping</option>
            <option value="Cinema">Cinema</option>
            <option value="Show">Show</option>
            <option value="Festa">Festa</option>
            <option value="Outro">Outro</option>
          </select>
          <input type="text" id="custom-type-input" placeholder="Especifique o tipo de encontro" style="display: none;">
          <input type="text" id="desc-input" placeholder="Descrição do encontro">
          <input type="text" id="location-input" placeholder="Local do encontro">
          <input type="text" id="maps-link-input" placeholder="Link do Google Maps">
          <button id="save-special-date">Salvar</button>
        `;
        // Adicionar listener para mostrar/esconder campo personalizado
        const typeSelect = document.getElementById('type-input');
        const customTypeInput = document.getElementById('custom-type-input');
        typeSelect.addEventListener('change', () => {
          customTypeInput.style.display = typeSelect.value === 'Outro' ? 'block' : 'none';
        });
        break;
      case 'add-cronograma':
        modalTitle.textContent = 'Adicionar Cronograma';
        modalBody.innerHTML = `
          <input type="text" id="cronograma-desc" placeholder="Descrição">
          <input type="text" id="cronograma-date" placeholder="Data (ex: 23/04/2025)">
          <input type="text" id="cronograma-time" placeholder="Hora (ex: 20:00)">
          <button id="save-cronograma">Salvar</button>
        `;
        break;
      case 'add-challenge':
        modalTitle.textContent = 'Adicionar Desafio';
        modalBody.innerHTML = `
          <input type="text" id="challenge-desc" placeholder="Descrição do desafio">
          <input type="text" id="challenge-date" placeholder="Data (ex: 23/04/2025)">
          <button id="save-challenge">Salvar</button>
        `;
        break;
      case 'delete-challenge':
        modalTitle.textContent = 'Excluir Desafio';
        modalBody.innerHTML = '<select id="challenge-select"></select><button id="delete-challenge-btn">Excluir</button>';
        populateChallengeSelect();
        break;
    }
    modal.style.display = 'flex';
  } catch (error) {
    console.error('Erro ao abrir modal:', error);
  }
}

function closeModal() {
  try {
    console.log('Fechando modal');
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.getElementById('modal-content').classList.remove('vintage');
  } catch (error) {
    console.error('Erro ao fechar modal:', error);
  }
}

// Salvar Legenda
function saveLegend() {
  try {
    console.log('Salvando legenda');
    const legend = document.getElementById('legend-input')?.value;
    const day = document.getElementById('day-input')?.value;
    if (legend && day) {
      const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      selectedDays[dateKey] = legend;
      set(ref(db, 'legends/' + dateKey), legend)
        .then(() => {
          console.log('Legenda salva:', dateKey, legend);
          renderCalendar();
          closeModal();
        })
        .catch(error => console.error('Erro ao salvar legenda:', error));
    } else {
      console.warn('Legenda ou dia não preenchidos');
    }
  } catch (error) {
    console.error('Erro em saveLegend:', error);
  }
}

// Salvar Dias de Namoro
function saveDatingDays() {
  try {
    console.log('Salvando dias de namoro');
    const select = document.getElementById('day-select');
    if (select) {
      datingDays = Array.from(select.selectedOptions).map(opt => Number(opt.value));
      set(ref(db, 'datingDays'), datingDays)
        .then(() => {
          console.log('Dias de namoro salvos:', datingDays);
          renderCalendar();
          closeModal();
        })
        .catch(error => console.error('Erro ao salvar dias de namoro:', error));
    } else {
      console.warn('Elemento day-select não encontrado');
    }
  } catch (error) {
    console.error('Erro em saveDatingDays:', error);
  }
}

// Salvar Encontro Especial
function saveSpecialDate() {
  try {
    console.log('Salvando encontro especial');
    const dateInput = document.getElementById('date-input')?.value;
    const time = document.getElementById('time-input')?.value;
    const typeSelect = document.getElementById('type-input')?.value;
    const customType = document.getElementById('custom-type-input')?.value;
    const desc = document.getElementById('desc-input')?.value;
    const location = document.getElementById('location-input')?.value;
    const mapsLink = document.getElementById('maps-link-input')?.value;
    const date = parseDate(dateInput);
    // Usar tipo personalizado se "Outro" for selecionado e campo preenchido
    const type = typeSelect === 'Outro' && customType ? customType : typeSelect;
    if (date && time) {
      const encounter = { date: dateInput, time, type, desc, location, mapsLink };
      specialDates.push(encounter);
      push(ref(db, 'specialDates'), encounter)
        .then(() => {
          console.log('Encontro especial salvo:', encounter);
          renderCalendar();
          renderEncounters();
          closeModal();
        })
        .catch(error => console.error('Erro ao salvar encontro especial:', error));
    } else {
      console.warn('Data ou hora não preenchidos');
    }
  } catch (error) {
    console.error('Erro em saveSpecialDate:', error);
  }
}

// Salvar Cronograma
function saveCronograma() {
  try {
    console.log('Salvando cronograma');
    const desc = document.getElementById('cronograma-desc')?.value;
    const dateInput = document.getElementById('cronograma-date')?.value;
    const time = document.getElementById('cronograma-time')?.value;
    const date = parseDate(dateInput);
    if (desc && date && time) {
      push(ref(db, 'cronogramas'), { desc, date: dateInput, time })
        .then(() => {
          console.log('Cronograma salvo:', desc, date, time);
          renderCronogramas();
          closeModal();
        })
        .catch(error => console.error('Erro ao salvar cronograma:', error));
    } else {
      console.warn('Descrição, data ou hora não preenchidos');
    }
  } catch (error) {
    console.error('Erro em saveCronograma:', error);
  }
}

// Salvar Desafio
function saveChallenge() {
  try {
    console.log('Salvando desafio');
    const desc = document.getElementById('challenge-desc')?.value;
    const dateInput = document.getElementById('challenge-date')?.value;
    const date = parseDate(dateInput);
    if (desc && date) {
      push(ref(db, 'challenges'), { desc, date: dateInput })
        .then(() => {
          console.log('Desafio salvo:', desc, date);
          renderChallenges();
          closeModal();
        })
        .catch(error => console.error('Erro ao salvar desafio:', error));
    } else {
      console.warn('Descrição ou data não preenchidos');
    }
  } catch (error) {
    console.error('Erro em saveChallenge:', error);
  }
}

// Excluir Desafio
function deleteChallenge() {
  try {
    console.log('Excluindo desafio');
    const select = document.getElementById('challenge-select');
    const id = select?.value;
    if (id) {
      remove(ref(db, 'challenges/' + id))
        .then(() => {
          console.log('Desafio excluído:', id);
          renderChallenges();
          closeModal();
        })
        .catch(error => console.error('Erro ao excluir desafio:', error));
    } else {
      console.warn('Nenhum desafio selecionado');
    }
  } catch (error) {
    console.error('Erro em deleteChallenge:', error);
  }
}

// Preencher Seleção de Desafios
function populateChallengeSelect() {
  try {
    console.log('Populando seleção de desafios');
    const select = document.getElementById('challenge-select');
    if (select) {
      select.innerHTML = '';
      onValue(ref(db, 'challenges'), snapshot => {
        const challenges = snapshot.val();
        if (challenges) {
          for (let id in challenges) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = challenges[id].desc;
            select.appendChild(option);
          }
        }
      }, { onlyOnce: true });
    }
  } catch (error) {
    console.error('Erro em populateChallengeSelect:', error);
  }
}

// Renderizar Cronogramas
function renderCronogramas() {
  try {
    console.log('Renderizando cronogramas');
    const list = document.getElementById('cronograma-list');
    if (list) {
      list.innerHTML = '';
      onValue(ref(db, 'cronogramas'), snapshot => {
        list.innerHTML = '';
        const cronogramas = snapshot.val();
        if (cronogramas) {
          for (let id in cronogramas) {
            const item = cronogramas[id];
            const date = new Date(`${parseDate(item.date)}T${item.time}`);
            const li = document.createElement('div');
            li.className = 'flex justify-between items-center my-3 p-2 bg-opacity-20 bg-white rounded';
            li.innerHTML = `
              <span>${item.desc} - <span id="countdown-${id}"></span></span>
              <button class="animated-btn" id="remove-cronograma-${id}">Excluir</button>
            `;
            list.appendChild(li);
            li.querySelector(`#remove-cronograma-${id}`).addEventListener('click', () => removeCronograma(id, item.desc));
            updateCronogramaCountdown(id, date);
          }
        }
      });
    }
  } catch (error) {
    console.error('Erro em renderCronogramas:', error);
  }
}

// Remover Cronograma
function removeCronograma(id, desc) {
  try {
    console.log('Removendo cronograma:', id);
    remove(ref(db, 'cronogramas/' + id))
      .then(() => {
        console.log('Cronograma excluído:', desc);
        renderCronogramas();
      })
      .catch(error => console.error('Erro ao excluir cronograma:', error));
  } catch (error) {
    console.error('Erro em removeCronograma:', error);
  }
}

// Atualizar Contador de Cronograma
function updateCronogramaCountdown(id, date) {
  try {
    const update = () => {
      const now = new Date();
      const diff = date - now;
      if (diff <= 0) return;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const element = document.getElementById(`countdown-${id}`);
      if (element) {
        element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        element.className = days > 3 ? 'neon-blue' : days === 2 ? 'neon-orange' : 'neon-red';
      }
    };
    update();
    setInterval(update, 1000);
  } catch (error) {
    console.error('Erro em updateCronogramaCountdown:', error);
  }
}

// Renderizar Desafios
function renderChallenges() {
  try {
    console.log('Renderizando desafios');
    const list = document.getElementById('challenge-list');
    if (list) {
      list.innerHTML = '';
      onValue(ref(db, 'challenges'), snapshot => {
        list.innerHTML = '';
        const challenges = snapshot.val();
        if (challenges) {
          for (let id in challenges) {
            const item = challenges[id];
            const date = new Date(parseDate(item.date));
            const li = document.createElement('div');
            li.className = 'flex justify-between items-center my-3 p-2 bg-opacity-20 bg-white rounded';
            li.innerHTML = `
              <span>${item.desc} - <span id="challenge-countdown-${id}"></span></span>
              <button class="animated-btn" id="remove-challenge-${id}">Excluir</button>
            `;
            list.appendChild(li);
            li.querySelector(`#remove-challenge-${id}`).addEventListener('click', () => removeChallenge(id, item.desc));
            updateChallengeCountdown(id, date);
          }
        }
      });
    }
  } catch (error) {
    console.error('Erro em renderChallenges:', error);
  }
}

// Remover Desafio
function removeChallenge(id, desc) {
  try {
    console.log('Removendo desafio:', id);
    remove(ref(db, 'challenges/' + id))
      .then(() => {
        console.log('Desafio excluído:', desc);
        renderChallenges();
      })
      .catch(error => console.error('Erro ao excluir desafio:', error));
  } catch (error) {
    console.error('Erro em removeChallenge:', error);
  }
}

// Atualizar Contador de Desafios
function updateChallengeCountdown(id, date) {
  try {
    const update = () => {
      const now = new Date();
      const diff = date - now;
      if (diff <= 0) return;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const element = document.getElementById(`challenge-countdown-${id}`);
      if (element) {
        element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        element.className = days > 3 ? 'neon-green' : days === 2 ? 'neon-orange' : 'neon-red';
      }
    };
    update();
    setInterval(update, 1000);
  } catch (error) {
    console.error('Erro em updateChallengeCountdown:', error);
  }
}

// Renderizar Encontros
function renderEncounters() {
  try {
    console.log('Renderizando encontros');
    const list = document.getElementById('encontro-list');
    if (list) {
      list.innerHTML = '';
      onValue(ref(db, 'specialDates'), snapshot => {
        list.innerHTML = '';
        const encounters = snapshot.val();
        if (encounters) {
          for (let id in encounters) {
            const item = encounters[id];
            const li = document.createElement('div');
            li.className = 'flex flex-col my-3 p-2 bg-opacity-20 bg-white rounded';
            li.innerHTML = `
              <div class="flex justify-between items-center">
                <span><strong>Tipo:</strong> ${item.type || 'Não especificado'} - <strong>Data:</strong> ${item.date} às ${item.time}</span>
                <button class="animated-btn" id="remove-encontro-${id}">Excluir</button>
              </div>
              <p><strong>Descrição:</strong> ${item.desc || 'Não especificado'}</p>
              <p><strong>Local:</strong> ${item.location || 'Não especificado'}</p>
              <p><strong>Google Maps:</strong> ${item.mapsLink ? `<a href="${item.mapsLink}" target="_blank" class="underline text-blue-300 hover:text-blue-100">Abrir Mapa</a>` : 'Não especificado'}</p>
            `;
            list.appendChild(li);
            li.querySelector(`#remove-encontro-${id}`).addEventListener('click', () => removeEncounter(id, item.date));
          }
        }
      });
    }
  } catch (error) {
    console.error('Erro em renderEncounters:', error);
  }
}

// Remover Encontro
function removeEncounter(id, date) {
  try {
    console.log('Removendo encontro:', id);
    remove(ref(db, 'specialDates/' + id))
      .then(() => {
        console.log('Encontro excluído:', date);
        renderEncounters();
        renderCalendar();
        updateCountdown();
      })
      .catch(error => console.error('Erro ao excluir encontro:', error));
  } catch (error) {
    console.error('Erro em removeEncounter:', error);
  }
}

// Atualizar Contador Regressivo
function updateCountdown() {
  try {
    const now = new Date();
    let closestDate = null;

    // Verificar Dias de Namoro
    datingDays.forEach(day => {
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + ((day - now.getDay() + 7) % 7));
      nextDate.setHours(20, 0, 0, 0);
      if (nextDate > now && (!closestDate || nextDate < closestDate)) {
        closestDate = nextDate;
      }
    });

    // Verificar Encontros Especiais
    specialDates.forEach(item => {
      const date = new Date(`${parseDate(item.date)}T${item.time}`);
      if (date > now && (!closestDate || date < closestDate)) {
        closestDate = date;
      }
    });

    const countdownElement = document.getElementById('countdown');
    if (closestDate) {
      const diff = closestDate - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      countdownElement.textContent = `Próximo encontro em: ${days} dias, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;
      countdownElement.className = `countdown ${days > 3 ? 'neon-blue' : days === 2 ? 'neon-orange' : 'neon-red'}`;
    } else {
      countdownElement.textContent = 'Nenhum encontro próximo';
      countdownElement.className = 'countdown';
    }
    setTimeout(updateCountdown, 1000);
  } catch (error) {
    console.error('Erro em updateCountdown:', error);
  }
}

// Navegação entre Meses
function prevMonth() {
  try {
    console.log('Navegando para mês anterior');
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  } catch (error) {
    console.error('Erro em prevMonth:', error);
  }
}

function nextMonth() {
  try {
    console.log('Navegando para próximo mês');
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  } catch (error) {
    console.error('Erro em nextMonth:', error);
  }
}

// Compartilhar
function shareOnSocial() {
  try {
    console.log('Compartilhando nas redes sociais');
    const text = encodeURIComponent('Confira nosso calendário romântico! 💖 #NossoCalendario');
    window.open(`https://twitter.com/intent/tweet?text=${text}`);
  } catch (error) {
    console.error('Erro em shareOnSocial:', error);
  }
}

// Scroll para o Topo
function scrollToTop() {
  try {
    console.log('Rolando para o topo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Erro em scrollToTop:', error);
  }
}

// Fechar Menu Após Clique
function closeMenu() {
  try {
    console.log('Fechando menu');
    document.getElementById('menuToggle').checked = false;
    document.querySelector('.menu-nav').classList.remove('show');
  } catch (error) {
    console.error('Erro em closeMenu:', error);
  }
}

// Toggle Menu Mobile
function toggleMenu() {
  const menuNav = document.querySelector('.menu-nav');
  const isChecked = document.getElementById('menuToggle').checked;
  console.log('Toggling menu, checked:', isChecked);
  if (isChecked) {
    menuNav.classList.add('show');
  } else {
    menuNav.classList.remove('show');
  }
  console.log('Menu-nav classes:', menuNav.className);
}

// Inicializar Eventos
function initEventListeners() {
  try {
    console.log('Inicializando event listeners');
    document.getElementById('scroll-to-top').addEventListener('click', (e) => {
      e.preventDefault();
      scrollToTop();
    });
    document.getElementById('add-legend-link').addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Clicado em Adicionar Legenda');
      openModal('add-legend');
      closeMenu();
    });
    document.getElementById('select-days-link').addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Clicado em Selecionar Dias');
      openModal('select-days');
      closeMenu();
    });
    document.getElementById('set-date-link').addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Clicado em Definir Encontro');
      openModal('set-date');
      closeMenu();
    });
    document.getElementById('share-link').addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Clicado em Compartilhar');
      shareOnSocial();
      closeMenu();
    });
    document.getElementById('prev-month').addEventListener('click', () => {
      console.log('Clicado em Anterior');
      prevMonth();
    });
    document.getElementById('next-month').addEventListener('click', () => {
      console.log('Clicado em Próximo');
      nextMonth();
    });
    document.getElementById('add-cronograma').addEventListener('click', () => {
      console.log('Clicado em Adicionar Cronograma');
      openModal('add-cronograma');
    });
    document.getElementById('add-challenge').addEventListener('click', () => {
      console.log('Clicado em Adicionar Desafio');
      openModal('add-challenge');
    });
    document.getElementById('delete-challenge').addEventListener('click', () => {
      console.log('Clicado em Excluir Desafio');
      openModal('delete-challenge');
    });
    document.getElementById('add-encontro').addEventListener('click', () => {
      console.log('Clicado em Adicionar Encontro');
      openModal('set-date');
    });
    document.getElementById('close-modal').addEventListener('click', () => {
      console.log('Clicado em Fechar Modal');
      closeModal();
    });
    document.getElementById('modal').addEventListener('click', (e) => {
      if (e.target === document.getElementById('modal')) {
        console.log('Clicado fora do modal');
        closeModal();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.id === 'save-legend') {
        console.log('Clicado em Salvar Legenda');
        saveLegend();
      }
      if (e.target.id === 'save-dating-days') {
        console.log('Clicado em Salvar Dias de Namoro');
        saveDatingDays();
      }
      if (e.target.id === 'save-special-date') {
        console.log('Clicado em Salvar Encontro Especial');
        saveSpecialDate();
      }
      if (e.target.id === 'save-cronograma') {
        console.log('Clicado em Salvar Cronograma');
        saveCronograma();
      }
      if (e.target.id === 'save-challenge') {
        console.log('Clicado em Salvar Desafio');
        saveChallenge();
      }
      if (e.target.id === 'delete-challenge-btn') {
        console.log('Clicado em Excluir Desafio (modal)');
        deleteChallenge();
      }
    });

    // Debug menu toggle
    document.getElementById('menuToggle').addEventListener('change', (e) => {
      console.log('Menu toggle changed:', e.target.checked);
      toggleMenu();
    });

    console.log('Event listeners inicializados');
  } catch (error) {
    console.error('Erro ao inicializar event listeners:', error);
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('DOM carregado, iniciando aplicação');
    initEventListeners();

    onValue(ref(db, 'legends'), snapshot => {
      console.log('Sincronizando legends');
      selectedDays = snapshot.val() || {};
      renderCalendar();
    }, error => console.error('Erro ao sincronizar legends:', error));

    onValue(ref(db, 'specialDates'), snapshot => {
      console.log('Sincronizando specialDates');
      specialDates = [];
      snapshot.forEach(child => {
        specialDates.push(child.val());
      });
      renderCalendar();
      renderEncounters();
      updateCountdown();
    }, error => console.error('Erro ao sincronizar specialDates:', error));

    onValue(ref(db, 'datingDays'), snapshot => {
      console.log('Sincronizando datingDays');
      datingDays = snapshot.val() || [6];
      updateCountdown();
    }, error => console.error('Erro ao sincronizar datingDays:', error));

    console.log('Iniciando renderizações iniciais');
    renderCalendar();
    renderCronogramas();
    renderChallenges();
    renderEncounters();
    console.log('Aplicação inicializada');
  } catch (error) {
    console.error('Erro ao inicializar aplicação:', error);
  }
});