import { ISxStyleObject } from "/imports/typings/ISxStyleObject";

export const toDosListStyle: ISxStyleObject = {
    switchesContainer: {
        display: "flex",
        flexDirection: 'row',
        flexWrap: 'wrap',

        gap: '10px',
        justifyContent: 'center',
        width: '100%',

    },

    paginationContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap-reverse",
        gap: "10px",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    }
}