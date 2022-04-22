/**
 * 
 */
export default async (command, entity, args) => {
    import(`./${command}.js`).then(({ default: module }) => {
        module(entity, args);
    });
};
