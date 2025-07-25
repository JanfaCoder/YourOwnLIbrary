// index.html 에서 책 저장
if (document.getElementById("bookForm")) {
  document.getElementById("bookForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const summary = document.getElementById("summary").value;

    const book = {
      title,
      author,
      summary,
      rating: null,
      favorite: false
    };

    const books = JSON.parse(localStorage.getItem("books") || "[]");
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));

    window.location.href = "library.html";
  });
}

// library.html 기능
if (document.getElementById("library")) {
  const books = JSON.parse(localStorage.getItem("books") || "[]");
  const libraryDiv = document.getElementById("library");

  // 책 권 수 표시
  const countDiv = document.createElement("div");
  countDiv.innerHTML = `<h2>총 ${books.length}권의 책이 있습니다 📚</h2>`;
  libraryDiv.appendChild(countDiv);

  // 삭제 모드 버튼 추가
  const deleteModeBtn = document.createElement("button");
  deleteModeBtn.textContent = "🗑️ 삭제 모드 켜기";
  deleteModeBtn.style.marginBottom = "15px";
  libraryDiv.appendChild(deleteModeBtn);
  let deleteMode = false;

  deleteModeBtn.addEventListener("click", () => {
    deleteMode = !deleteMode;
    deleteModeBtn.textContent = deleteMode ? "❌ 삭제 모드 끄기" : "🗑️ 삭제 모드 켜기";
    renderBooks();
  });

  function renderBooks() {
    // 기존 책들 초기화
    const oldBooks = document.querySelectorAll(".book");
    oldBooks.forEach(el => el.remove());

    books.forEach((book, index) => {
      const bookDiv = document.createElement("div");
      bookDiv.className = "book";

      const summaryId = `summary-${index}`;
      bookDiv.innerHTML = `
        <h3>${book.title}</h3>
        <p><strong>작가:</strong> ${book.author}</p>
        <p>
          <button class="toggleSummaryBtn" data-id="${summaryId}">📖 줄거리 보기</button>
          <div id="${summaryId}" class="summary" style="display:none; margin-top:5px;">
            ${book.summary}
          </div>
        </p>
        <p>
          <strong>평점:</strong> 
          <select data-index="${index}">
            <option value="">-- 선택 --</option>
            ${[1,2,3,4,5].map(num => `<option value="${num}" ${book.rating == num ? "selected" : ""}>${"⭐".repeat(num)}</option>`).join("")}
          </select>
        </p>
        <p>
          <button class="favoriteBtn" data-index="${index}" style="font-size: 20px; background: none; border: none; cursor: pointer;">
            ${book.favorite ? "❤️" : "🤍"}
          </button>
        </p>
        ${deleteMode ? `<button class="deleteBtn" data-index="${index}">삭제</button>` : ""}
      `;
      libraryDiv.appendChild(bookDiv);
    });

    // 평점 이벤트
    document.querySelectorAll("select").forEach(select => {
      select.addEventListener("change", function () {
        const idx = this.getAttribute("data-index");
        books[idx].rating = parseInt(this.value);
        localStorage.setItem("books", JSON.stringify(books));
      });
    });

    // 줄거리 토글
    document.querySelectorAll(".toggleSummaryBtn").forEach(btn => {
      btn.addEventListener("click", function () {
        const targetId = this.getAttribute("data-id");
        const summaryDiv = document.getElementById(targetId);
        if (summaryDiv.style.display === "none") {
          summaryDiv.style.display = "block";
          this.textContent = "🙈 줄거리 숨기기";
        } else {
          summaryDiv.style.display = "none";
          this.textContent = "📖 줄거리 보기";
        }
      });
    });

    // 삭제 기능
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = this.getAttribute("data-index");
        books.splice(idx, 1);
        localStorage.setItem("books", JSON.stringify(books));
        location.reload(); // 다시 불러오기
      });
    });

    // 즐겨찾기 토글
    document.querySelectorAll(".favoriteBtn").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = this.getAttribute("data-index");
        books[idx].favorite = !books[idx].favorite;
        localStorage.setItem("books", JSON.stringify(books));
        renderBooks(); // 새로고침 없이 다시 그림
      });
    });
  }

  renderBooks();
}
