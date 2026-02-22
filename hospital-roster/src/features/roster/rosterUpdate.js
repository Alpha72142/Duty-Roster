export const applyCreateAssignment = (matrix, assignment) => {
  return matrix.map((row) => {
    if (row.worker.id !== assignment.workerId) return row;

    return {
      ...row,
      cells: {
        ...row.cells,
        [assignment.date]: assignment,
      },
    };
  });
};

export const applyRemoveAssignment = (matrix, workerId, date) => {
  return matrix.map((row) => {
    if (row.worker.id !== workerId) return row;

    return {
      ...row,
      cells: {
        ...row.cells,
        [date]: null,
      },
    };
  });
};

export const applyEditAssignment = (matrix, assignment) => {
  return matrix.map((row) => {
    if (row.worker.id !== assignment.workerId) return row;

    return {
      ...row,
      cells: {
        ...row.cells,
        [assignment.date]: assignment,
      },
    };
  });
};
