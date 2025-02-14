export const getIfCuidExists = (model: any, value: string) => {
  if (!model['findFirst']) throw Error('Not a valid model');
  return model['findFirst']({ where: { cuid: value } });
};
