import { Recurso as Exemplo } from '/imports/modules/example/config/Recursos';
import { Recurso as ToDos } from '/imports/modules/toDos/config/Recursos'

import { RoleType } from '/imports/seguranca/config/RoleType';

type MapRolesRecursos = {
    [key: string]: string[];
};

// @ts-ignore
function obterStringsEnum(enumValue: { [s: number]: string | number }): [string] {
    // @ts-ignore
    return Object.values(enumValue).filter((value) => typeof value === 'string');
}

/**
 * Mapeamento entre as roles (perfil de usuário) e os recursos.
 * chave: role.
 * valores: recursos.
 *
 *
 * O nome do recurso deve ser prefixado com nome do módulo.
 *
 * Favor manter a ordem alfabética no nome dos módulos.
 *
 */
export const mapRolesRecursos: MapRolesRecursos = {
    [RoleType.ADMINISTRADOR]: [
        ToDos.TODOS_VIEW,
        ToDos.TODOS_CREATE,
        ToDos.TODOS_UPDATE,
        ToDos.TODOS_REMOVE,
        Exemplo.EXAMPLE_VIEW,
        Exemplo.EXAMPLE_CREATE,
        Exemplo.EXAMPLE_UPDATE,
        Exemplo.EXAMPLE_REMOVE,
    ],
    [RoleType.USUARIO]: [
        ToDos.TODOS_VIEW,
        ToDos.TODOS_CREATE,
        ToDos.TODOS_UPDATE,
        ToDos.TODOS_REMOVE,
        Exemplo.EXAMPLE_VIEW,
        Exemplo.EXAMPLE_CREATE,
        Exemplo.EXAMPLE_UPDATE,
        Exemplo.EXAMPLE_REMOVE,
    ],
    [RoleType.PUBLICO]: [],
};
