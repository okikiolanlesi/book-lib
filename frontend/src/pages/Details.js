import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../axiosLib";

const Details = () => {
  const { id } = useParams();
  const [book, setBook] = useState({});
  useEffect(() => {
    const fetchBook = async () => {
      const res = await axios.get(`/books/${id}`);
      setBook(res.data.data.book);
      console.log(res.data.data.book);
    };
    fetchBook();
  }, [id]);
  return (
    <div className="px-3 sm:px-10">
      <div className="py-4 mb-4 ">
        <Link to="/">
          <div className="text-2xl font-medium text-blue-400 hover:text-blue-600 inline">
            Back to Home
          </div>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-2xl sm:text-6xl text-black-500 font-bold  sm:mb-4">
          {book.title}
        </div>
        <div className="text-gray-500 sm:mb-2">
          {book.author ? `Written by ${book.author.username}` : null}
        </div>
        <div className="text-gray-500 sm:mb-2">
          {book.category ? `Category: ${book.category}` : null}
        </div>
        <div className="text-gray-500 sm:mb-2">
          {book.isbn ? `ISBN: ${book.isbn}` : null}
        </div>
      </div>
      <div className="text-gray-700 mt-5 text-lg sm:mb-2 sm:text-xl md:text-2xl">
        {" "}
        {book.body}
      </div>
    </div>
  );
};

export default Details;
