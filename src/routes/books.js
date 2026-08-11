const express = require('express');
const supabase = require('../../config/supabase');

const router = express.Router();

router.post('/lookup', async (req, res) => {
  try {
    const { isbn } = req.body;

    if (!isbn) {
      return res.status(400).json({
        message: 'ISBN is required',
      });
    }

    // Remove hyphens/spaces
    const cleanISBN = isbn.toString().replace(/[-\s]/g, '');

    // 1. Check if we already have this book
    const { data: existingBook, error: existingError } =
      await supabase
        .from('books')
        .select('*')
        .or(`isbn13.eq.${cleanISBN},isbn10.eq.${cleanISBN}`)
        .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingBook) {
      return res.json(existingBook);
    }

    // 2. Get book from Open Library
//`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanISBN}`
    const response = await fetch(
      `https://openlibrary.org/isbn/${cleanISBN}.json`
    );

    if (!response.ok) {
      return res.status(404).json({
        message: 'Book not found',
      });
    }

    const openLibraryBook = await response.json();

    // 3. Convert Open Library response
    const book = {
      isbn13:
        openLibraryBook.isbn_13?.[0] ??
        (cleanISBN.length === 13 ? cleanISBN : null),

      isbn10:
        openLibraryBook.isbn_10?.[0] ??
        (cleanISBN.length === 10 ? cleanISBN : null),

      title: openLibraryBook.title,
      subtitle: openLibraryBook.subtitle,

      number_of_pages: openLibraryBook.number_of_pages,

      publish_date: openLibraryBook.publish_date,

      publishers: openLibraryBook.publishers ?? [],

      subjects: openLibraryBook.subjects ?? [],

      covers: openLibraryBook.covers ?? [],

      lc_classifications:
        openLibraryBook.lc_classifications ?? [],

      weight: openLibraryBook.weight,
    };

    // 4. Save to Supabase
    const { data: savedBook, error: saveError } =
      await supabase
        .from('books')
        .insert(book)
        .select()
        .single();

    if (saveError) {
      throw saveError;
    }

    // 5. Return saved book
    res.status(201).json(savedBook);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to lookup book',
    });
  }
});

module.exports = router;