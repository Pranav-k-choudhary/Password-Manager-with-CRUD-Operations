import React from "react";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Manager = ({ user, authToken, onLogout }) => {
  const ref = useRef();
  const passwordRef = useRef();

  const [form, setForm] = useState({
    site: "",
    username: "",
    password: "",
    id: "",
  });

  const [passwordArray, setPasswordArray] = useState([]);
  const [visiblePasswordId, setVisiblePasswordId] = useState(null);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ROWS_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(passwordArray.length / ROWS_PER_PAGE));
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedPasswords = passwordArray.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  );
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5600";

  const authHeaders = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const handleUnauthorized = () => {
    toast.error('Session expired. Please login again.');
    onLogout();
  };

  const getPasswords = async () => {
    try {
      const response = await fetch(`${API_BASE}/passwords`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const passwords = await response.json();
      setPasswordArray(passwords);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load passwords from backend");
    }
  };

  useEffect(() => {
    if (!authToken) return;
    getPasswords();
  }, [authToken]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [passwordArray.length, totalPages, currentPage]);

  const showPass = () => {
    setShowFormPassword((prev) => !prev);
    if (passwordRef.current) {
      passwordRef.current.type = showFormPassword ? "password" : "text";
    }
  };

  const savePass = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      try {
        const method = form.id ? "PUT" : "POST";
        const url = form.id
          ? `${API_BASE}/passwords/${form.id}`
          : `${API_BASE}/passwords`;

        const response = await fetch(url, {
          method,
          headers: authHeaders,
          body: JSON.stringify({
            site: form.site,
            username: form.username,
            password: form.password,
          }),
        });

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to save password");
        }

        const savedItem = await response.json();
        setPasswordArray((prev) => {
          if (form.id) {
            return prev.map((item) =>
              item.id === savedItem.id ? savedItem : item
            );
          }
          return [...prev, savedItem];
        });

        setForm({
          site: "",
          username: "",
          password: "",
          id: "",
        });

        toast.success("Password saved successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Could not save password");
      }
    } else {
      toast.error("Please fill all fields correctly!");
    }
  };

  const delPass = async (id) => {
    const conf = confirm(
      "Are you sure you want to delete this password?"
    );

    if (!conf) return;

    try {
      const response = await fetch(`${API_BASE}/passwords/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete password");
      }

      setPasswordArray((prev) => prev.filter((item) => item.id !== id));

      toast.success("Password deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete password");
    }
  };

  const editPass = (id) => {
    const selected = passwordArray.find((i) => i.id === id);

    if (!selected) return;

    setForm({
      ...selected,
      id,
    });
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

      <div className="mycontainer px-4 sm:px-10 md:px-20 py-3 pt-7">
        <h2 className="text-3xl text font-bold text-center">
          <span className="text-green-600">&lt;</span>
          Password
          <span className="text-green-600"> Manager/&gt;</span>
        </h2>

        <p className="text text-sm sm:text-lg text-center text-green-700">
          Welcome, {user.email || 'secure user'}
        </p>

        <form
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
          className="text flex flex-col p-4 text-black gap-6 items-center"
        >
          <input
            type="text"
            name="fake-username"
            autoComplete="username"
            aria-hidden="true"
            tabIndex={-1}
            style={{ position: "absolute", left: "-10000px", top: "auto", width: 0, height: 0, overflow: "hidden" }}
          />

          <input
            type="password"
            name="fake-password"
            autoComplete="current-password"
            aria-hidden="true"
            tabIndex={-1}
            style={{ position: "absolute", left: "-10000px", top: "auto", width: 0, height: 0, overflow: "hidden" }}
          />

          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL"
            className="rounded border border-green-700 w-full p-1 py-1"
            type="text"
            name="site"
            autoComplete="off"
          />

          <div className="flex flex-col md:flex-row w-full gap-6 justift-between">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded border border-green-700 w-full p-1 py-1"
              name="username"
              type="text"
              autoComplete="off"
            />

            <div className="relative w-full md:w-64">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded border border-green-700 w-full p-1 py-1"
                name="password"
                type={showFormPassword ? "text" : "password"}
                autoComplete="new-password"
              />

              <span className="absolute right-2 top-1/2 -translate-y-1/2">
                <svg
                  onClick={showPass}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 cursor-pointer hover:scale-110 transition flex-shrink-0"
                  role="button"
                  aria-label={showFormPassword ? "Hide password" : "Show password"}
                >
                  {showFormPassword ? (
                    // Closed eye icon
                    <path
                      fill="currentColor"
                      d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 2.93-4.75-1.73-3.89-6-7-11-7-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 3.89 6 7 11 7 1.71 0 3.36-.29 4.9-.82l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm0 0l3.15 3.15"/>
                  ) : (
                    // Open eye icon
                    <path
                      fill="currentColor"
                      d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                  )}
                </svg>
              </span>
            </div>
          </div>

          <button
            onClick={savePass}
            className="flex justify-center items-center gap-2 bg-green-600 rounded-full border-2 border-green-900 px-4 sm:px-5 py-1 text-sm sm:text-base w-fit hover:bg-green-400"
          >
            <lord-icon
              src="https://cdn.lordicon.com/efxgwrkc.json"
              trigger="hover"
            ></lord-icon>

            {form.id ? "Update Password" : "Add Password"}
          </button>
        </form>

        <div className="passwords overflow-x-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-800 py-4">
            Your Passwords
          </h2>

          <table className="w-full text-xs sm:text-sm md:text-base rounded-md overflow-hidden shadow-lg mb-20 min-w-full table-fixed">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="py-2">Site</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody className="bg-green-100">
              {paginatedPasswords.map((item, index) => {
                return (
                  <tr key={index}>
                    {/* Site */}
                    <td className="py-1 text-left align-top border border-green-300">
                      <div className="flex items-center justify-between gap-2 px-2">
                        <a
                          href={item.site}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate block max-w-[220px]"
                        >
                          {item.site}
                        </a>

                        <svg
                          onClick={() => copyText(item.site)}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          className="hover:scale-110 transition duration-300 cursor-pointer w-5 h-5 flex-shrink-0"
                        >
                          <path d="M288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448L480 448C515.3 448 544 419.3 544 384L544 183.4C544 166 536.9 149.3 524.3 137.2L466.6 81.8C454.7 70.4 438.8 64 422.3 64L288 64z" />
                        </svg>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="py-1 text-left align-top border border-green-300">
                      <div className="flex items-center justify-between gap-2 px-2">
                        <span className="truncate block max-w-[160px]">{item.username}</span>

                        <svg
                          onClick={() => copyText(item.username)}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          className="hover:scale-110 transition duration-300 cursor-pointer w-5 h-5 flex-shrink-0"
                        >
                          <path d="M288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448L480 448C515.3 448 544 419.3 544 384L544 183.4C544 166 536.9 149.3 524.3 137.2L466.6 81.8C454.7 70.4 438.8 64 422.3 64L288 64z" />
                        </svg>
                      </div>
                    </td>

                    <td className="relative py-2 text-left min-w-[150px] border border-green-300">
                      <div className="flex items-center justify-start gap-3 px-3">
                        {/* Password text */}
                        <span className="min-w-[90px] max-w-[120px] block truncate text-left">
                          {visiblePasswordId === item.id
                            ? item.password
                            : "\u2022".repeat(item.password.length)}
                        </span>
                        {/* Eye Icon */}
                        <svg
                          onClick={() =>
                            setVisiblePasswordId((prev) =>
                              prev === item.id ? null : item.id
                            )
                          }
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-5 h-5 cursor-pointer hover:scale-110 transition flex-shrink-0"
                          role="button"
                          aria-label={
                            visiblePasswordId === item.id
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                            <path
                            fill="currentColor"
                            d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                        </svg>
                        {/* Copy Icon */}
                        <svg
                          onClick={() => copyText(item.password)}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          className="w-5 h-5 cursor-pointer hover:scale-110 transition flex-shrink-0">
                            <path d="M288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448L480 448C515.3 448 544 419.3 544 384L544 183.4C544 166 536.9 149.3 524.3 137.2L466.6 81.8C454.7 70.4 438.8 64 422.3 64L288 64z" />
                        </svg>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="relative py-1 text-center min-w-32 border border-green-300">
                      <div className="flex justify-end md:justify-end gap-2 py-1 px-1 mr-3">
                        <span
                          onClick={() =>
                            editPass(item.id)
                          }
                        >
                          <svg
                            className="hover:scale-110 transition duration-300 cursor-pointer mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
                            />
                          </svg>
                        </span>

                        <span
                          onClick={() =>
                            delPass(item.id)
                          }
                        >
                          <svg
                            className="hover:scale-110 transition duration-300 cursor-pointer text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 7h12l-1 14H7L6 7zm3-3h6l1 2H8l1-2z" />
                          </svg>
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {passwordArray.length > ROWS_PER_PAGE && (
            <div className="flex flex-wrap items-center justify-center gap-3 py-4 text-green-800">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-green-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-200"
              >
                Previous
              </button>

              <span className="text-sm sm:text-base">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-green-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-200"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;