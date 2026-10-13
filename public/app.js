const API_URL = '/api/notes';

let notes = [];
let selectedColor = '#ffffff';
let editSelectedColor = '#ffffff';
let currentFilter = 'all';

async function loadNotes() {
  try {
    const response = await fetch(API_URL);
    notes = await response.json();
    updateNoteCount();
    displayNotes(notes);
  } catch (error) {
    console.error('Error loading notes:', error);
    showToast('Error loading notes', 'error');
  }
}

function updateNoteCount() {
  document.getElementById('totalNotes').textContent = `${notes.length} note${notes.length !== 1 ? 's' : ''}`;
}

function displayNotes(notesToDisplay) {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = '';

  if (notesToDisplay.length === 0) {
    notesList.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: white;">
        <i class="fas fa-sticky-note" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
        <p style="font-size: 18px;">No notes found</p>
      </div>
    `;
    return;
  }

  notesToDisplay.forEach((note, index) => {
    const noteCard = document.createElement('div');
    noteCard.className = `note-card ${note.isPinned ? 'pinned' : ''}`;
    noteCard.style.backgroundColor = note.color;
    noteCard.style.animationDelay = `${index * 0.1}s`;
    
    const tagsHtml = note.tags && note.tags.length > 0 
      ? `<div class="note-tags">
          ${note.tags.map(tag => `<span class="note-tag">${escapeHtml(tag)}</span>`).join('')}
        </div>` 
      : '';

    noteCard.innerHTML = `
      <h3>${escapeHtml(note.title)}</h3>
      ${tagsHtml}
      <p>${escapeHtml(note.content)}</p>
      <div class="note-date">
        <i class="fas fa-calendar-alt"></i>
        ${new Date(note.createdAt).toLocaleDateString()}
      </div>
      <div class="note-actions">
        <button class="pin-btn ${note.isPinned ? 'pinned' : ''}" onclick="togglePin('${note._id}')">
          <i class="fas fa-thumbtack"></i> ${note.isPinned ? 'Unpin' : 'Pin'}
        </button>
        <button class="edit-btn" onclick="openEditModal('${note._id}')">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="delete-btn" onclick="deleteNote('${note._id}')">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    `;
    notesList.appendChild(noteCard);
  });
}

async function createNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  const tagsInput = document.getElementById('noteTags').value.trim();
  const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

  if (!title || !content) {
    showToast('Please fill in both title and content', 'error');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, content, tags, color: selectedColor })
    });

    if (response.ok) {
      document.getElementById('noteTitle').value = '';
      document.getElementById('noteContent').value = '';
      document.getElementById('noteTags').value = '';
      selectedColor = '#ffffff';
      updateColorSelection();
      loadNotes();
      showToast('Note created successfully!', 'success');
    } else {
      showToast('Error creating note', 'error');
    }
  } catch (error) {
    console.error('Error creating note:', error);
    showToast('Error creating note', 'error');
  }
}

async function deleteNote(id) {
  if (!confirm('Are you sure you want to delete this note?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      loadNotes();
      showToast('Note deleted successfully!', 'success');
    } else {
      showToast('Error deleting note', 'error');
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    showToast('Error deleting note', 'error');
  }
}

async function togglePin(id) {
  try {
    const note = notes.find(n => n._id === id);
    if (!note) return;

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        title: note.title, 
        content: note.content, 
        tags: note.tags,
        color: note.color,
        isPinned: !note.isPinned 
      })
    });

    if (response.ok) {
      loadNotes();
      showToast(note.isPinned ? 'Note unpinned' : 'Note pinned!', 'success');
    } else {
      showToast('Error updating note', 'error');
    }
  } catch (error) {
    console.error('Error toggling pin:', error);
    showToast('Error updating note', 'error');
  }
}

function openEditModal(id) {
  const note = notes.find(n => n._id === id);
  if (note) {
    document.getElementById('editNoteId').value = note._id;
    document.getElementById('editNoteTitle').value = note.title;
    document.getElementById('editNoteContent').value = note.content;
    document.getElementById('editNoteTags').value = note.tags ? note.tags.join(', ') : '';
    editSelectedColor = note.color || '#ffffff';
    updateEditColorSelection();
    document.getElementById('noteModal').style.display = 'block';
  }
}

function closeModal() {
  document.getElementById('noteModal').style.display = 'none';
}

async function updateNote() {
  const id = document.getElementById('editNoteId').value;
  const title = document.getElementById('editNoteTitle').value.trim();
  const content = document.getElementById('editNoteContent').value.trim();
  const tagsInput = document.getElementById('editNoteTags').value.trim();
  const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

  if (!title || !content) {
    showToast('Please fill in both title and content', 'error');
    return;
  }

  try {
    const note = notes.find(n => n._id === id);
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        title, 
        content, 
        tags, 
        color: editSelectedColor,
        isPinned: note ? note.isPinned : false 
      })
    });

    if (response.ok) {
      closeModal();
      loadNotes();
      showToast('Note updated successfully!', 'success');
    } else {
      showToast('Error updating note', 'error');
    }
  } catch (error) {
    console.error('Error updating note:', error);
    showToast('Error updating note', 'error');
  }
}

async function searchNotes() {
  const query = document.getElementById('searchInput').value.trim();
  
  if (!query) {
    filterNotes(currentFilter);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/search/${encodeURIComponent(query)}`);
    const searchResults = await response.json();
    displayNotes(searchResults);
  } catch (error) {
    console.error('Error searching notes:', error);
    showToast('Error searching notes', 'error');
  }
}

function filterNotes(filter) {
  currentFilter = filter;
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

  let filteredNotes = notes;
  
  if (filter === 'pinned') {
    filteredNotes = notes.filter(note => note.isPinned);
  } else if (filter === 'recent') {
    filteredNotes = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  displayNotes(filteredNotes);
}

function updateColorSelection() {
  document.querySelectorAll('.color-options .color-option').forEach(option => {
    option.classList.remove('selected');
    if (option.dataset.color === selectedColor) {
      option.classList.add('selected');
    }
  });
}

function updateEditColorSelection() {
  document.querySelectorAll('#editColorOptions .color-option').forEach(option => {
    option.classList.remove('selected');
    if (option.dataset.color === editSelectedColor) {
      option.classList.add('selected');
    }
  });
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.getElementById('searchInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchNotes();
  }
});

document.querySelectorAll('.color-options .color-option').forEach(option => {
  option.addEventListener('click', function() {
    selectedColor = this.dataset.color;
    updateColorSelection();
  });
});

document.querySelectorAll('#editColorOptions .color-option').forEach(option => {
  option.addEventListener('click', function() {
    editSelectedColor = this.dataset.color;
    updateEditColorSelection();
  });
});

window.onclick = function(event) {
  const modal = document.getElementById('noteModal');
  if (event.target === modal) {
    closeModal();
  }
}

loadNotes();
