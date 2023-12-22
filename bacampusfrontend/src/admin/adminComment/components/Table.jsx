import React, { useState } from "react";
import { FaSortDown, FaSortUp, FaSort } from "react-icons/fa";
import { useMediaQuery } from "@react-hook/media-query";
import TableMobile from "./TableMobile";
import "../scss/button.scss";
import "../scss/table.scss";

export default function Table({ head, body, searchable }) {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [sorting, setSorting] = useState(false);
  const [search, setSearch] = useState("");
  const filteredData =
    body &&
    body
      .filter((items) =>
        items.some((item) =>
          (item?.key || item?.props?.searchableText || item)
            .toString()
            .toLocaleLowerCase("tr")
            .includes(search.toLocaleLowerCase("tr"))
        )
      )
      .sort((a, b) => {
        if (sorting?.orderBy === "asc") {
          return (
            a[sorting.key]?.key ||
            a[sorting.key]?.props?.searchableText ||
            a[sorting.key]
          )
            .toString()
            .localeCompare(
              b[sorting.key]?.key ||
                b[sorting.key]?.props?.searchableText ||
                b[sorting.key]
            );
        }
        if (sorting?.orderBy === "desc") {
          return b[sorting.key].toString().localeCompare(a[sorting.key]);
        }
      });

  if (!body || body?.length === 0) {
    return (
      <div className="p-4 rounded bg-yellow-100 text-yellow-700 text-sm">
        Gösterilecek veri bulunmuyor.
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <div className="flex gap-x-2 justify-start">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Tabloda ara"
            className="search-input"
          />
          {sorting && (
            <button
              onClick={() => setSorting(false)}
              className="sort-button cancel-sort-button"
            >
              Sıralamayı İptal Et
            </button>
          )}
        </div>
      </div>
      {isMobile && <TableMobile head={head} body={filteredData} />}
      {!isMobile && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                {head.map((h, key) => (
                  <th width={h?.width} className="text-left" key={key}>
                    <div className="inline-flex items-center gap-x-2">
                      {h.name}
                      {h.sortable && (
                        <button
                          onClick={() => {
                            if (sorting?.key === key) {
                              setSorting({
                                key,
                                orderBy:
                                  sorting.orderBy === "asc" ? "desc" : "asc",
                              });
                            } else {
                              setSorting({
                                key,
                                orderBy: "asc",
                              });
                            }
                          }}
                          className="sort-button"
                        >
                          {sorting?.key === key &&
                            sorting?.orderBy === "asc" && (
                              <FaSortUp className="sort-icon" />
                            )}
                          {sorting?.key === key &&
                            sorting?.orderBy === "desc" && (
                              <FaSortDown className="sort-icon" />
                            )}
                          {sorting?.key !== key && (
                            <FaSort className="sort-icon" />
                          )}
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((items, key) => (
                <tr className="group" key={key}>
                  {items.map((item, key) => (
                    <td
                      className="p-3 text-sm group-hover:bg-blue-50 group-hover:text-blue-600"
                      key={key}
                    >
                      {Array.isArray(item) ? (
                        <div className="flex gap-x-2.5">{item}</div>
                      ) : (
                        item
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
