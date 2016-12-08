(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name IncompatibilityFactory
   * @module gaia.lot2.front
   * @description
   *
   * Manage the incompatibilities
   */

  angular
    .module('gaia.lot2.front')
    .factory('IncompatibilityFactory', IncompatibilityFactory);

  /* @ngInject */
  function IncompatibilityFactory(IncompatibilityService, $translate, $q) {
    return {
      get                 : get,
      hasIncompatibilities: hasIncompatibilities,
      getIncompatibilities: getIncompatibilities,
      prettify            : prettify
    };

    ////////////////

    /**
     * @ngdoc method
     * @name IncompatibilityFactory#get
     * @description
     * Retrieve some incompatibilities depending on the given parameters:
     * structureType: The list of possible incompatibilities for a all structure type
     * tsif         : With what TSIFs the given `tsif` is incompatible ?
     * nivol & tsif : Is the adherent `nivol` incompatible with the `tsif` ?
     *
     * @param   {number=}          tsif           The tsif ID
     * @param   {string=}          nivol          The adherent nivol
     * @param   {string=}          structureType  The structure type
     * @returns {Promise<Array>}
     */
    function get (tsif, nivol, structureType) {
      var _p = $q.defer();

      IncompatibilityService.get(tsif, nivol, structureType).then(function (incompatibilities) {
        _p.resolve(incompatibilities.data.plain());
      }, function(err) {
        _p.reject(err);
      });

      return _p.promise;
    }

    /**
     * @ngdoc method
     * @name IncompatibilityFactory#hasIncompatibilities
     * @description
     * Is there any incompatibilities on the given adherent ?
     *
     * @param   {Object|null}  adherent   Adherent to check
     * @return  {boolean}                 TRUE if it has; FALSE otherwise
     */
    function hasIncompatibilities (adherent) {
      return angular.isDefined(adherent) &&
        adherent !== null &&
        angular.isDefined(adherent.incompatibilitesDTO) &&
        adherent.incompatibilitesDTO !== null &&
        adherent.incompatibilitesDTO.length > 0;
    }

    /**
     * @ngdoc method
     * @name IncompatibilityFactory#getIncompatibilities
     * @description
     * Retrieve the function incompatibilities depending on the displayed adherent
     *
     * @param   {Object}  fct   The TSIF populated with adherent information
     * @returns {Array}         The function incompatibilities
     */
    function getIncompatibilities (fct) {
      if (fct.userIdentique !== null && hasIncompatibilities(fct.userIdentique)) {
        return fct.userIdentique.incompatibilitesDTO;
      }

      if (fct.userEntree !== null && hasIncompatibilities(fct.userEntree)) {
        return fct.userEntree.incompatibilitesDTO;
      }

      return [];
    }

    /**
     * @ngdoc method
     * @name IncompatibilityFactory#prettify
     * @description
     * Prettify an incompatibility
     *
     * @param   {Object}  incompatibility
     * @return  {string}                    The prettified incompatibility
     */
    function prettify (incompatibility) {
      if (incompatibility.typeStructureInstanceFonctionB !== null) {
        return $translate.instant('incompatibility.function' + ((incompatibility.structureLabel) ? '.with-structure' : ''), {
          fct: incompatibility.typeStructureInstanceFonctionB.fonctionElection.nom,
          structure: incompatibility.structureLabel
        });
      }

      if (incompatibility.nominationId !== null) {
        return $translate.instant('incompatibility.nomination', {
          nomination: incompatibility.nominationLabel
        });
      }

      return '';
    }
  }

})();

